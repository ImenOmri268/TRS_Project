import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../lib/jwt'

export async function POST(request) {
    try{
        const{newPassword, token}=await request.json();

        if(!newPassword){
            return NextResponse.json(
                {message:'Nouveau mot de passe requis'},
                {status: 400}
            );
        }

        let userId;

        if (token){
            try{
                const decoded= verifyToken(token);
                userId=decoded.id;
            }catch{
                return NextResponse.json(
                    {message:'Lien invalide ou expiré'},
                    {status:401}
                );
            }
        }else{
            const cookieToken = request.cookies.get('token')?.value;

            if(!cookieToken){
                return NextResponse.json(
                    {message: 'Non authentifié'},
                    {status:401}
                );
            }

            try{
                const decoded = verifyToken(cookieToken);
                userId = decoded.id;
            }catch {
                return NextResponse.json(
                    {message:'Session invalide ou expiré'},
                    {status:401}
                );
            }
        }
            //hash nv mdp
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            //maj en bdd
            await prisma.user.update({
                where: {id: userId},
                data:{
                    password: hashedPassword,
                    mustChangePassword: false
                }
            });

            return NextResponse.json(
                {message: 'Mot de passe modifié avec succès'},
                {status: 200}
            );

    }catch(error){
            console.error('[CHANGE PASSWORD ERROR]', error);
            return NextResponse.json(
                {message: 'Erreur serveur'},
                {status: 500}
            )
        }
    
}