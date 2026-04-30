import { NextResponse } from "next/server";

export async function POST() {
    try{
        const response = NextResponse.json(
        {message: "Déconnexion réussie"},
        {status:200}
        );

       response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        maxAge:0 //supp token immediat
       });
       return response;
    }catch(error){
        console.error('[LOGOUT ERROR]',error)
        return NextResponse.json(
            {message: 'Erreur Serveur'},
            {status:500}
        )
    }
}