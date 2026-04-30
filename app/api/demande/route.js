import { NextResponse } from "next/server";
import nodemailer from 'nodemailer'
import { prisma } from "@/app/lib/prisma";
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        const { nom, rue, codePostal, ville, telephone, email } = await request.json()

        // Vérification champs obligatoires
        if (!nom || !email) {
            return NextResponse.json(
                { message: 'Nom et email obligatoires' },
                { status: 400 }
            )
        }

        // Vérifier si demande déjà envoyée
        const demandeExistante = await prisma.demande.findFirst({
            where: { email }
        })
        if (demandeExistante) {
            return NextResponse.json(
                { message: 'Une demande existe déjà pour cet email' },
                { status: 409 }
            )
        }

        
        const userExistant = await prisma.user.findUnique({
            where: { email }
        })
        if (userExistant) {
            return NextResponse.json(
                { message: 'Un compte existe déjà avec cet email' },
                { status: 409 }
            )
        }

        const mdpTemporaire = Math.random().toString(36).slice(-8) // ex: "k7x2m9pq"
        const hashedPassword = await bcrypt.hash(mdpTemporaire, 10)

        
        const admin = await prisma.user.create({
            data: {
                name: nom,
                email: email,
                password: hashedPassword,
                status: true,
                type: 'ADMIN',
                mustChangePassword: true  
            }
        })

        
        await prisma.demande.create({
            data: {
                nom,
                rue,
                codePostal,
                ville,
                telephone,
                email,
                statut: 'ACCEPTEE'  
            }
        })

        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,                    
            subject: 'Vos identifiants de connexion - TRS',
            html: `
                <h2>Bienvenue sur la plateforme TRS !</h2>
                <p>Votre demande a été acceptée. Voici vos identifiants :</p>
                <br/>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Mot de passe temporaire :</strong> ${mdpTemporaire}</p>
                <br/>
                <p>Connectez-vous et changez votre mot de passe immédiatement.</p>
                <p><a href="${process.env.APP_URL}">Se connecter</a></p>
            `
        })

        return NextResponse.json(
            { message: 'Demande envoyée avec succès !' },
            { status: 201 }
        )

    } catch (error) {
        console.error('[DEMANDE ERROR]', error)
        return NextResponse.json(
            { message: 'Erreur serveur' },
            { status: 500 }
        )
    }
}