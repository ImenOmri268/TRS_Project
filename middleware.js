import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'

const publicRoutes = ['/', '/SignUp', '/resetPassword', '/EmailSend']

const userPagePermissions = {
  '/user/Dashboard'    : 'voir_dashboard',
  '/user/Objectifs'    : ['voir_objectifs', 'ajouter_objectif', 'modifier_objectif', 'supprimer_objectif'],
  '/user/Ressources'   : ['voir_ressources', 'ajouter_ressource', 'modifier_ressource', 'supprimer_ressource'],
  '/user/Utilisateurs' : ['voir_utilisateurs', 'ajouter_utilisateur', 'modifier_utilisateur', 'supprimer_utilisateur'],
  '/user/CollecteTRS'  : 'faire_collecte',
  '/user/SuiviTRS'     : 'suivre_trs',
  '/user/Traitements'  : ['consulter_traitements', 'generer_traitements'],
  '/user/PlanAction'   : 'voir_plan_action',

}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Pages publiques
  if (publicRoutes.includes(pathname)) {
    if (token && pathname === '/') {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        if (payload.type === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
        } else if (payload.type === 'USER') {
          return NextResponse.redirect(new URL(`/user/Dashboard`, request.url))
        }
      } catch {
        const response = NextResponse.next()
        response.cookies.delete('token')
        return response
      }
    }
    return NextResponse.next()
  }

  // Pas de token → login
  if (!token) {
    if (pathname === '/') return NextResponse.next()
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // ADMIN → accès total aux pages /admin
    if (payload.type === 'ADMIN') {
      if (pathname.startsWith('/user')) {
        return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
      }
      return NextResponse.next()
    }

    // USER → vérifier permissions depuis la DB
    if (payload.type === 'USER') {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/user/Dashboard', request.url))
      }

      const permissionRequise = userPagePermissions[pathname]
      if (permissionRequise) {
        // Vérifier depuis l'API profil (toujours à jour depuis la DB)
        try {
          const profilRes = await fetch(new URL('/api/user/profil', request.url), {
            headers: { cookie: `token=${token}` }
          })
          if (!profilRes.ok) {
            return NextResponse.redirect(new URL('/user/Dashboard', request.url))
          }
          const profil = await profilRes.json()
          const hasPermission = Array.isArray(permissionRequise)
            ? permissionRequise.some((perm) => profil.permissions?.includes(perm))
            : profil.permissions?.includes(permissionRequise)
          if (!hasPermission) {
            return NextResponse.redirect(new URL('/user/Dashboard', request.url))
          }
        } catch {
          return NextResponse.redirect(new URL('/user/Dashboard', request.url))
        }
      }

      return NextResponse.next()
    }

    return NextResponse.next()

  } catch {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ]
}