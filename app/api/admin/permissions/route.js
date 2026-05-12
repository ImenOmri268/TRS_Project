import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/jwt';

// ─── GET: Fetch Permissions ──────────────────────────────────────────────
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
    
    // Verify token but we don't necessarily need the decoded data for a simple fetch
    verifyToken(token);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Case A: Fetch permissions for a specific user (useful for the Details view)
    if (userId) {
      const userPermissions = await prisma.userPermission.findMany({
        where: { userId: parseInt(userId) },
        include: { permission: true },
      });
      // Returns a clean array of permission objects: [{id, name}, ...]
      return NextResponse.json(userPermissions.map(up => up.permission));
    }

    // Case B: Fetch ALL available permissions 
    // This is used by AjoutUserForm to populate the 8 checkboxes
    const allPermissions = await prisma.permission.findMany({
      orderBy: { id: 'asc' }, // Ordering by ID keeps the list consistent with your config
    });

    return NextResponse.json(allPermissions);
  } catch (error) {
    console.error('[PERMISSIONS_GET_ERROR]', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// ─── POST: Sync User Permissions (Stand-alone) ───────────────────────────
// NOTE: You can keep this if you want to update permissions WITHOUT updating user info,
// but your Users API PUT method already handles this logic.
export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    
    if (decoded.type !== 'ADMIN') {
      return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
    }

    const { userId, permissionIds } = await request.json();

    if (!userId || !Array.isArray(permissionIds)) {
      return NextResponse.json({ message: 'Données invalides' }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      // Wipe existing
      await tx.userPermission.deleteMany({
        where: { userId: parseInt(userId) },
      });

      // Create new links
      if (permissionIds.length > 0) {
        await tx.userPermission.createMany({
          data: permissionIds.map((pId) => ({
            userId: parseInt(userId),
            permissionId: parseInt(pId),
          })),
        });
      }
    });

    return NextResponse.json({ message: 'Permissions synchronisées' });
  } catch (error) {
    console.error('[PERMISSIONS_POST_ERROR]', error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// ─── DELETE: Logic remains standard ──────────────────────────────────────
export async function DELETE(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (decoded.type !== 'ADMIN') return NextResponse.json({ message: 'Refusé' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));
    const permissionId = parseInt(searchParams.get('permissionId'));

    await prisma.userPermission.delete({
      where: {
        userId_permissionId: { userId, permissionId },
      },
    });

    return NextResponse.json({ message: 'Lien supprimé' });
  } catch (error) {
    return NextResponse.json({ message: 'Erreur de suppression' }, { status: 500 });
  }
}