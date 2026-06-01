import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/jwt";

// Helper function to extract a validated adminId integer from token
async function getValidatedAdminId(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    // If your DB uses integers for IDs, wrap this in parseInt. If strings, remove parseInt.
    const decodedId = parseInt(decoded.id, 10); 
    
    let adminId = decoded.type === 'ADMIN' ? decodedId : null;

    if (!adminId) {
      const user = await prisma.user.findUnique({
        where: { id: decodedId },
        select: { adminId: true }
      });
      adminId = user?.adminId;
    }
    return adminId;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

// 1. GET: Fetch notifications
export async function GET(request) {
  try {
    const adminId = await getValidatedAdminId(request);
    if (!adminId) {
      return NextResponse.json({ error: "Non authentifié ou Admin introuvable" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: adminId },
      orderBy: { date: "desc" }, // Verify if your schema field is 'date' or 'createdAt'
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Erreur GET Notifications:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// 2. PUT: Mark all as read
export async function PUT(request) {
  try {
    const adminId = await getValidatedAdminId(request);
    if (!adminId) {
      return NextResponse.json({ error: "Non authentifié ou Admin introuvable" }, { status: 401 });
    }

    await prisma.notification.updateMany({
      where: { userId: adminId, lu: false },
      data: { lu: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: Clear history
export async function DELETE(request) {
  try {
    const adminId = await getValidatedAdminId(request);
    if (!adminId) {
      return NextResponse.json({ error: "Non authentifié ou Admin introuvable" }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: { userId: adminId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}