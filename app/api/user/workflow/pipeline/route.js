import { verifyToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
 // Adjusted path to match your JWT utility placement


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    const ressourceId = searchParams.get("ressourceId");

    // Cas A : Charger les données des étapes d'un traitement actif dans le pipeline
    if (workflowId) {
      const id = parseInt(workflowId, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: "ID de traitement invalide." }, { status: 400 });
      }

      const analyses = await prisma.analyse.findMany({
        where: { workflowId: id }
      });
      return NextResponse.json(analyses);
    }

    // Cas B : Charger l'historique des sessions pour le sélecteur d'une ressource
    if (!ressourceId) {
      return NextResponse.json({ error: "Le paramètre ressourceId est requis pour le sélecteur." }, { status: 400 });
    }

    const workflows = await prisma.workflow.findMany({
      where: { ressourceId: parseInt(ressourceId, 10) },
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nom: true,
        dateDebut: true,
        pdfUrl: true,
      }
    });

    return NextResponse.json(workflows);
  } catch (error) {
    console.error("Erreur GET [workflow/pipeline]:", error);
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * 2. POST : Sauvegarde ou mise à jour d'une étape (Brainstorming, Pareto...)
 * Également compatible si ton front-end permet de créer directement un traitement.
 */
export async function POST(req) {
  try {
    // 🔐 Extraction et vérification sécurisée du Token
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    // Récupération de l'identité de l'utilisateur en BDD
    const actor = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });

    let targetAdminId;
    if (decoded.type === 'ADMIN') {
      targetAdminId = decoded.id;
    } else {
      targetAdminId = actor?.adminId;
    }

    if (!targetAdminId) {
      return NextResponse.json({ error: "Admin introuvable ou non lié" }, { status: 404 });
    }

    const traceName = actor?.name || "Un utilisateur";
    const body = await req.json();
    const { nom, ressourceId, workflowId, type, contenu } = body;

    // =========================================================
    // SOUS-CAS 2.1 : Sauvegarde/Mise à jour des données d'une étape Lean
    // =========================================================
    if (workflowId && type) {
      let parsedContenu = typeof contenu === "string" ? JSON.parse(contenu) : contenu;

      // Calcul automatique de la distribution statistique si l'étape est un PARETO
      if (type === "PARETO" && Array.isArray(parsedContenu)) {
        const totalProblems = parsedContenu.reduce((sum, item) => sum + (item.problems?.length || 0), 0);
        parsedContenu = parsedContenu.map(item => {
          const problemCount = item.problems?.length || 0;
          const percentage = totalProblems > 0 ? (problemCount / totalProblems) * 100 : 0;
          return {
            ...item,
            count: problemCount,
            percentage: parseFloat(percentage.toFixed(2))
          };
        });
      }

      // Recherche si l'étape existe déjà pour ce workflow
      const existingAnalysis = await prisma.analyse.findFirst({
        where: { workflowId: parseInt(workflowId, 10), type: type }
      });

      let stepResult;
      if (existingAnalysis) {
        stepResult = await prisma.analyse.update({
          where: { id: existingAnalysis.id },
          data: { contenu: JSON.stringify(parsedContenu) }
        });
      } else {
        stepResult = await prisma.analyse.create({
          data: {
            workflowId: parseInt(workflowId, 10),
            type: type,
            contenu: JSON.stringify(parsedContenu)
          }
        });
      }

      // Récupération du nom du traitement pour personnaliser la notification
      const targetWorkflow = await prisma.workflow.findUnique({
        where: { id: parseInt(workflowId, 10) },
        select: { nom: true }
      });

      // 🛠️ Traducteur dynamique pour correspondre précisément à tes outils Lean
      let actionLabel = `les données de l'étape ${type}`;
      if (type === "BRAINSTORMING") actionLabel = "des données au brainstorming";
      if (type === "PARETO") actionLabel = "des données du diagramme de Pareto";
      if (type === "5_POURQUOI" || type === "5_WHYS") actionLabel = "des données des 5 Pourquoi";
      if (type === "ISHIKAWA") actionLabel = "des données du diagramme d'Ishikawa";
      if (type === "RAPPORT" || type === "REPORT") actionLabel = "un rapport d'analyse";

      // Création de la notification de type ACTION
      try {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${traceName} a enregistré ${actionLabel} pour le traitement : "${targetWorkflow?.nom || workflowId}".`,
            userId: targetAdminId,
            createdBy: traceName
          }
        });
      } catch (nErr) {
        console.error('[WORKFLOW_STEP_NOTIF_ERROR]', nErr);
      }

      return NextResponse.json({ success: true, data: stepResult });
    }

    // =========================================================
    // SOUS-CAS 2.2 : Initialisation d'un traitement depuis le sélecteur
    // =========================================================
    if (!nom || !ressourceId) {
      return NextResponse.json({ error: "Données manquantes pour l'initialisation du traitement." }, { status: 400 });
    }

    const newWorkflow = await prisma.workflow.create({
      data: {
        nom: nom,
        ressourceId: parseInt(ressourceId, 10),
        analyse: {
          create: {
            type: "BRAINSTORMING",
            contenu: JSON.stringify([{ id: 1, name: "Initial", problems: [] }])
          }
        }
      },
      include: { ressource: { select: { nom: true } } }
    });

    try {
      await prisma.notification.create({
        data: {
          message: `L'utilisateur ${traceName} a créé un workflow "${nom}" concernant la ressource : ${newWorkflow.ressource?.nom || ressourceId}.`,
          userId: targetAdminId,
          createdBy: traceName
        }
      });
    } catch (nErr) {
      console.error('[WORKFLOW_CREATE_NOTIF_ERROR]', nErr);
    }

    return NextResponse.json(newWorkflow);

  } catch (error) {
    console.error("Erreur POST [workflow/pipeline]:", error);
    return NextResponse.json({ error: "Échec du traitement de la requête." }, { status: 500 });
  }
}

/**
 * 3. DELETE : Permet de supprimer une session de traitement directement depuis le sélecteur
 */
export async function DELETE(request) {
  try {
    // 🔐 Extraction et vérification sécurisée du Token
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

    const decoded = verifyToken(token);

    const actor = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { name: true, adminId: true }
    });

    let targetAdminId;
    if (decoded.type === 'ADMIN') {
      targetAdminId = decoded.id;
    } else {
      targetAdminId = actor?.adminId;
    }

    const { searchParams } = new URL(request.url);
    const idString = searchParams.get("workflowId");
    const traceName = actor?.name || "Un utilisateur";

    if (!idString) {
      return NextResponse.json({ error: "Le paramètre workflowId est requis." }, { status: 400 });
    }

    const workflowId = parseInt(idString, 10);
    const existingWorkflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!existingWorkflow) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    // Nettoyage en cascade des analyses associées pour éviter les contraintes de clés étrangères
    await prisma.analyse.deleteMany({ where: { workflowId: workflowId } });
    await prisma.workflow.delete({ where: { id: workflowId } });

    // Envoi de la notification de suppression
    if (targetAdminId) {
      try {
        await prisma.notification.create({
          data: {
            message: `L'utilisateur ${traceName} a supprimé la session de traitement : "${existingWorkflow.nom}".`,
            userId: targetAdminId,
            createdBy: traceName
          }
        });
      } catch (nErr) {
        console.error('[WORKFLOW_DELETE_NOTIF_ERROR]', nErr);
      }
    }

    return NextResponse.json({ message: "Session supprimée avec succès." }, { status: 200 });

  } catch (error) {
    console.error("Erreur DELETE [workflow/pipeline]:", error);
    return NextResponse.json({ error: "Impossible de supprimer la session." }, { status: 500 });
  }
}