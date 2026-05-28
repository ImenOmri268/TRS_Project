import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 1. GET: Récupérer les notifications de l'admin
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId"); // Idéalement extrait de votre session/JWT

    if (!adminId) {
      return NextResponse.json({ error: "adminId requis" }, { status: 400 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(adminId) },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Erreur GET Notifications:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// 2. PUT: Marquer les notifications comme lues
export async function PUT(req) {
  try {
    const body = await req.json();
    const { adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: "adminId requis" }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: { userId: parseInt(adminId), lu: false },
      data: { lu: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Tout supprimer pour cet admin
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const adminId = searchParams.get("adminId");

    if (!adminId) {
      return NextResponse.json({ error: "adminId requis" }, { status: 400 });
    }

    await prisma.notification.deleteMany({
      where: { userId: parseInt(adminId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}