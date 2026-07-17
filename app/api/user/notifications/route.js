import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// --- 1. GET : Récupérer les notifications de l'utilisateur courant ---
export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdInt = parseInt(decoded.id, 10);

    const notifications = await prisma.notification.findMany({
      where: {
        userId: userIdInt,
      },
      orderBy: {
        date: "desc", // Matches the "date" field requested by your NotifBar map
      },
    });

    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Erreur GET notifications utilisateur:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// --- 2. PUT : Marquer toutes les notifications de l'utilisateur comme lues ---
export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdInt = parseInt(decoded.id, 10);

    await prisma.notification.updateMany({
      where: {
        userId: userIdInt,
        lu: false,
      },
      data: {
        lu: true,
      },
    });

    return NextResponse.json({ success: true, message: "Notifications marquées comme lues." });
  } catch (err) {
    console.error("Erreur PUT notifications utilisateur:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}

// --- 3. DELETE : Supprimer toutes les notifications de l'utilisateur ---
export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdInt = parseInt(decoded.id, 10);

    await prisma.notification.deleteMany({
      where: {
        userId: userIdInt,
      },
    });

    return NextResponse.json({ success: true, message: "Toutes les notifications ont été supprimées." });
  } catch (err) {
    console.error("Erreur DELETE notifications utilisateur:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression." }, { status: 500 });
  }
}