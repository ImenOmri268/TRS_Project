import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { signToken } from '../../../lib/jwt';
import nodemailer from 'nodemailer';


export async function POST(request){
    try{
        const {email} = await request.json();

        if (!email){
            return NextResponse.json(
                {message: 'Email requis'},
                {status:400}
            );
        }

        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user){
            return NextResponse.json(
                {message:'Aucun compte associé à cet email'},
                {status:404}
            );
        }

        const token = signToken(
            {id: user.id, email: user.email},
        );

        
        const resetLink = `${process.env.APP_URL}/resetPassword?token=${token}`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation de votre mot de passe - TRS',
            html: `
                <h2>Réinitialisation de mot de passe</h2>
                <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                <br/>
                <a href="${resetLink}" style="background:#4A72A7;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;">
                    Réinitialiser mon mot de passe
                </a>
                <br/><br/>
                <p>Ce lien expire dans 7 jours.</p>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            `
        });

        return NextResponse.json(
            {message:'Si cet email existe, un lien sera envoyé.' },
            {status:200}
        )
    }catch(error){
        console.error('[RESET PASSWORD ERROR]',error);
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }

}