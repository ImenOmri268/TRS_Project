import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '../../lib/prisma'
import { signToken } from '../../lib/jwt'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    if (!user.status) {
      return NextResponse.json(
        { message: 'Compte désactivé. Contactez votre administrateur.' },
        { status: 403 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    //***
    const permissions = user.roles.flatMap(ur =>
      ur.role.permissions.map(rp => rp.permission.name)
    )

    const token = signToken({
      id: user.id,
      email: user.email,
      type: user.type,
      mustChangePassword: user.mustChangePassword,
      permissions
    })

    //reponse lel front
    const response = NextResponse.json({
      message: 'Connexion réussie',
      mustChangePassword: user.mustChangePassword,
      type: user.type
    })

    //sockage maa token fel cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', //protec contre les attaques
      maxAge: 60 * 60 * 24 * 7 //7jours
    })

    return response  //front yekhou reponse + cookie

  } catch (error) {
    console.error('[LOGIN ERROR]', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}