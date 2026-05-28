import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { computeExecutablePath } from "@puppeteer/browsers";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ====================================================================
// GET: Vérifier et récupérer le statut du PDF existant pour l'utilisateur
// ====================================================================
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params; 
    const id = parseInt(resolvedParams.workflowId, 10); // Extrait selon l'arborescence [workflowId]

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID de session invalide." }, { status: 400 });
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id },
      select: { pdfUrl: true } 
    });

    if (!workflow) {
      return NextResponse.json({ error: "Session de traitement introuvable." }, { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Erreur lors de la récupération du statut PDF utilisateur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ====================================================================
// POST: Générer et compiler le rapport HTML vers PDF via Puppeteer
// ====================================================================
export async function POST(req, { params }) {
  try {
    const resolvedParams = await params; 
    const workflowId = parseInt(resolvedParams.workflowId, 10);

    if (isNaN(workflowId)) {
      return NextResponse.json({ error: "ID de session invalide." }, { status: 400 });
    }

    // Récupération complète de la session avec la relation 'analyse'
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: {
        ressource: true,
        analyse: true, // S'assure de matcher l'architecture de ton endpoint admin
      },
    });

    if (!workflow) {
      return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
    }

    // Extraction et isolation des segments du pipeline de traitement
    const brainstormingRaw = workflow.analyse.find(a => a.type === "BRAINSTORMING")?.contenu;
    const paretoraw = workflow.analyse.find(a => a.type === "PARETO")?.contenu;
    const whysRaw = workflow.analyse.find(a => a.type === "CINQ_POURQUOI")?.contenu;
    const ishikawaRaw = workflow.analyse.find(a => a.type === "ISHIKAWA")?.contenu;

    const safeParse = (rawStr) => {
      if (!rawStr) return null;
      try { return JSON.parse(rawStr); } catch { return rawStr; }
    };

    const brainstormingData = safeParse(brainstormingRaw);
    const paretoData = safeParse(paretoraw);
    const whysData = safeParse(whysRaw);
    const ishikawaData = safeParse(ishikawaRaw);

    // Template HTML structuré et moderne pour l'export
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Rapport Analytique - ${workflow.nom || 'Sans nom'}</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          body { 
            font-family: 'Plus Jakarta Sans', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @media print { 
            .no-split { page-break-inside: avoid; break-inside: avoid; }
          }
        </style>
      </head>
      <body class="bg-slate-50/30 text-slate-900 leading-normal antialiased p-5 space-y-4">
        
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-1 no-split">
          <div class="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
            <div>
              <span class="inline-block bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-xs mb-1.5">
                Rapport d'Analyse Qualité Personnel
              </span>
              <h1 class="text-xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-2xl">
                ${workflow.nom || 'Analyse de Session Directe'}
              </h1>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">ID Session</span>
              <span class="text-base font-black text-slate-800 font-mono">#${workflow.id}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div class="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60 flex flex-col justify-between text-center">
              <div>
                <span class="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">Ressource en cours d'Étude</span>
                <span class="text-sm font-bold text-slate-800 block">${workflow.ressource?.nom || "Non spécifiée"}</span>
              </div>
              
              ${workflow.ressource ? `
                <div class="text-[11px] text-slate-600 space-y-1 mt-2 pt-2 border-t border-slate-200/60 text-left">
                  ${workflow.ressource.description ? `<p><span class="font-semibold text-slate-700">Description :</span> ${workflow.ressource.description}</p>` : ''}
                  ${workflow.ressource.type ? `<p><span class="font-semibold text-slate-700">Type :</span> ${workflow.ressource.type}</p>` : ''}
                  
                  ${(workflow.ressource.initialQualite !== null || workflow.ressource.initialDisponibilite !== null || workflow.ressource.initialPerformance !== null) ? `
                    <div class="mt-1.5 pt-1.5 border-t border-slate-200/40">
                      <div class="grid grid-cols-3 gap-1.5 text-center bg-white p-1 rounded-lg border border-slate-200/40">
                        ${workflow.ressource.initialQualite !== null ? `<div><span class="text-slate-400 block text-[8px]">Qualité</span><span class="font-mono font-bold text-slate-800 text-xs">${workflow.ressource.initialQualite}%</span></div>` : ''}
                        ${workflow.ressource.initialDisponibilite !== null ? `<div><span class="text-slate-400 block text-[8px]">Dispo.</span><span class="font-mono font-bold text-slate-800 text-xs">${workflow.ressource.initialDisponibilite}%</span></div>` : ''}
                        ${workflow.ressource.initialPerformance !== null ? `<div><span class="text-slate-400 block text-[8px]">Perform.</span><span class="font-mono font-bold text-slate-800 text-xs">${workflow.ressource.initialPerformance}%</span></div>` : ''}
                      </div>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
            
            <div class="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 flex flex-col justify-center text-center">
              <span class="text-[9px] font-extrabold uppercase tracking-wider text-blue-500 block mb-0.5">Performance Globale</span>
              <span class="text-[11px] font-medium text-slate-600">
                Valeur TRS Final
                <span class="text-xl font-black text-blue-600 block mt-0.5 font-mono">
                  ${workflow.ressource?.finalTRS !== null && workflow.ressource?.finalTRS !== undefined ? `${workflow.ressource.finalTRS}%` : '100%'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-split">
          <div class="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight">1. Identification des Problèmes (Brainstorming)</h2>
            <span class="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Étape 01</span>
          </div>
          
          ${Array.isArray(brainstormingData) && brainstormingData.length > 0 ? `
            <div class="grid grid-cols-1 gap-3">
              ${brainstormingData.map((group) => `
                <div class="bg-slate-50/60 rounded-xl p-3.5 border border-slate-200/50">
                  <h3 class="text-xs font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span class="w-1 h-3 bg-blue-600 rounded-full"></span>
                    ${group.name || "Groupe sans nom"}
                  </h3>
                  <ul class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    ${Array.isArray(group.problems) ? group.problems.map((p) => p.text ? `
                      <li class="flex items-start gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                        <span class="text-blue-500 font-extrabold">•</span>
                        <span class="font-medium">${p.text}</span>
                      </li>
                    ` : '').join('') : '<p class="text-xs text-slate-400 italic">Aucun problème listé.</p>'}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span class="italic text-slate-400 text-xs">Aucune cause émise lors du remue-méninges.</span>
            </div>
          `}
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-split">
          <div class="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight">2. Analyse de Pareto (Classification 80/20)</h2>
            <span class="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Étape 02</span>
          </div>
          
          ${Array.isArray(paretoData) && paretoData.length > 0 ? `
            <div class="overflow-hidden border border-slate-200 rounded-xl bg-white mb-3">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-900 text-white text-[9px] font-bold uppercase tracking-wider">
                    <th class="py-2.5 px-4">Catégorie Analysée</th>
                    <th class="py-2.5 px-3 text-center">Occurrences</th>
                    <th class="py-2.5 px-3 text-center">Poids Relatif</th>
                    <th class="py-2.5 px-4 text-center">Pourcentage Cumulé</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
                  ${paretoData.map((item) => `
                    <tr class="${item.cumulative <= 80 ? 'bg-amber-50/30 font-medium' : 'hover:bg-slate-50/30'}">
                      <td class="py-2 px-4 font-bold text-slate-800">${item.name}</td>
                      <td class="py-2 px-3 text-center font-mono">${item.problemCount || item.count || 0}</td>
                      <td class="py-2 px-3 text-center font-mono">${item.weight || item.percentage || 0}%</td>
                      <td class="py-2 px-4 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${item.cumulative <= 80 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}">
                          ${item.cumulative}%
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <div class="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span class="italic text-slate-400 text-xs">Aucune hiérarchisation de Pareto enregistrée.</span>
            </div>
          `}
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-split">
          <div class="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight">3. Profondeur des Causes Racines (5 Pourquoi)</h2>
            <span class="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Étape 03</span>
          </div>
          
          ${whysData && Object.keys(whysData).length > 0 ? `
            <div class="space-y-3">
              ${Object.entries(whysData).map(([problemKey, steps]) => {
                const correspondingPareto = Array.isArray(paretoData) ? paretoData.find(p => p.id.toString() === problemKey) : null;
                const problemName = correspondingPareto ? correspondingPareto.name : `Axe Critique #${problemKey}`;

                return `
                  <div class="bg-slate-50/40 p-3.5 rounded-xl border border-slate-200/50">
                    <div class="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg mb-2 shadow-xs">
                      Axe Critique Prioritaire : ${problemName}
                    </div>
                    <div class="relative pl-3.5 space-y-1.5 before:absolute before:left-1.5 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-200">
                      ${Array.isArray(steps) ? steps.map((s, index) => `
                        <div class="bg-white rounded-lg border border-slate-200/60 p-2 shadow-2xs text-xs">
                          <div class="text-[8px] font-extrabold text-blue-600 uppercase tracking-wide mb-0.5">Pourquoi n°${index + 1} : "${s.why || '...'}"</div>
                          <div class="font-bold text-slate-800"><span class="text-slate-400 font-normal">Réponse fournie :</span> ${s.answer || '...'}</div>
                        </div>
                      `).join('') : '<p class="text-xs text-slate-400 italic">Chaîne d\'itération vide.</p>'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span class="italic text-slate-400 text-xs">L'arbre d'exploration des 5 Pourquoi est vierge.</span>
            </div>
          `}
        </div>

        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs no-split">
          <div class="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
            <h2 class="text-base font-extrabold text-slate-900 tracking-tight">4. Ventilation des Facteurs Multiples (Ishikawa 5M)</h2>
            <span class="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Étape 04</span>
          </div>
          
          ${ishikawaData && Object.keys(ishikawaData).length > 0 ? `
            <div class="space-y-4">
              ${Object.entries(ishikawaData).map(([problemKey, categories]) => {
                const correspondingPareto = Array.isArray(paretoData) ? paretoData.find(p => p.id.toString() === problemKey) : null;
                const problemName = correspondingPareto ? correspondingPareto.name : `Axe #${problemKey}`;

                const cleanLabel = (key) => {
                  const labels = {
                    methode: "Méthodes",
                    milieu: "Milieu / Environnement",
                    materiel: "Matériel / Équipements",
                    matiere: "Matières / Éléments",
                    main_doeuvre: "Main d'œuvre"
                  };
                  return labels[key] || key;
                };

                return `
                  <div>
                    <div class="bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-md mb-2 inline-block">
                      Effet Ciblé : ${problemName}
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      ${Object.entries(categories).map(([categoryKey, causes]) => `
                        <div class="border border-slate-200/80 rounded-xl p-2.5 bg-slate-50/50">
                          <h4 class="text-[9px] font-extrabold uppercase text-slate-400 border-b border-slate-100 pb-0.5 mb-1.5 tracking-wider">
                            ${cleanLabel(categoryKey)}
                          </h4>
                          <ul class="space-y-1">
                            ${Array.isArray(causes) && causes.length > 0 ? causes.map(cause => typeof cause === 'string' && cause.trim() !== "" ? `
                              <li class="text-xs text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-100 font-medium">
                                ${cause}
                              </li>
                            ` : '').join('') : '<li class="text-xs text-slate-400 italic">Aucun facteur lié.</li>'}
                          </ul>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div class="p-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span class="italic text-slate-400 text-xs">Aucun diagramme en arête de poisson configuré.</span>
            </div>
          `}
        </div>

      </body>
      </html>
    `;

    // Lancement de l'instance Puppeteer avec la configuration isolée (Prod vs Local)
    let browser;
    if (process.env.NODE_ENV === "production") {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      let localBrowserPath;
      try {
        localBrowserPath = computeExecutablePath({ browser: "chrome", channel: "stable" });
      } catch {
        try {
          localBrowserPath = computeExecutablePath({ browser: "chromium", channel: "stable" });
        } catch {
          localBrowserPath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
        }
      }

      browser = await puppeteer.launch({
        args: [],
        executablePath: localBrowserPath,
        headless: true,
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "18px", bottom: "18px", left: "18px", right: "18px" }
    });

    await browser.close();

    // Gestion de l'écriture physique du document compilé sur le serveur local/Vercel
    const reportsDir = path.join(process.cwd(), "public", "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const fileName = `rapport-analyse-${workflowId}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    
    fs.writeFileSync(filePath, pdfBuffer);
    const savedPublicUrl = `/reports/${fileName}`;

    // Mise à jour de la ligne en BDD
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: { pdfUrl: savedPublicUrl }
    });

    return NextResponse.json({ success: true, pdfUrl: updatedWorkflow.pdfUrl });

  } catch (error) {
    console.error("Erreur serveur lors de la compilation globale du rapport PDF:", error);
    return NextResponse.json({ error: "Échec du processus d'écriture de l'archive PDF." }, { status: 500 });
  }
}

// ====================================================================
// DELETE: Réinitialiser/Invalider le rapport existant lors d'un Edit (isDirty)
// ====================================================================
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.workflowId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.workflow.update({
      where: { id },
      data: { pdfUrl: null }
    });

    return NextResponse.json({ success: true, message: "Référence PDF réinitialisée." });
  } catch (error) {
    console.error("Erreur réinitialisation statut PDF:", error);
    return NextResponse.json({ error: "Erreur interne serveur" }, { status: 500 });
  }
}