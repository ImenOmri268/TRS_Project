import { NextResponse } from "next/server";
import {verifyToken} from "../../../lib/jwt";

export async function GET(request) {
    try{
        const token = request.cookies.get('token')?.value
        if (!token) {
            return NextResponse.json(
                {message: 'Non authentifié'},
                {status: 401}
            )
        }

        const decoded = verifyToken(token)

        const user= await prisma.user.findUnique({
            where: {id: decoded.id },
            include: {
                userPermissions: {
                    include: {permission: true}
                }
            }
        })
        if (!user){
            return NextResponse.json(
                {message: 'Utilisateur non trouvé'},
                {status: 404}
            )
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            userRole: user.userRole,
            status: user.status,
            permissions: user.userPermissions.map(up => up.permission.name)
        })

    }catch (error) {
        console.error('[PROFIL ERROR]', error)
        return NextResponse.json(
            {message: 'Erreur serveur'},
            {status: 500}
        )
    }
}








