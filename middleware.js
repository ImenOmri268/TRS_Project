import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'

const publicRoutes = ['/', '/SignUp', '/resetPassword', '/EmailSend']

// Permissions requises pour chaque page
const pagePermissions = {
  '/admin/Dashboard'    : 'voir_dashboard',
  '/admin/Objectifs'    : 'voir_objectifs',
  '/admin/Utilisateurs' : 'voir_utilisateurs',
  '/admin/Ressources'   : 'voir_ressources',
  '/admin/Suivi-TRS'    : 'voir_suivi_trs',
  '/admin/Traitements'  : 'voir_traitements',
  '/admin/Actions'      : 'voir_plan_action',
  '/admin/Controle'     : 'voir_controle',
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
        if (payload.type === 'SUPER_ADMIN') {
          return NextResponse.redirect(new URL('/superadmin/Dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
        }
      } catch {
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Pas de token → login
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // ADMIN → accès total aux pages /admin
    if (payload.type === 'ADMIN') {
      return NextResponse.next()
    }

    // USER → vérifier permissions selon la page
    if (payload.type === 'USER') {
      const permissionRequise = pagePermissions[pathname]
      
      if (permissionRequise) {
        const hasPermission = payload.permissions?.includes(permissionRequise)
        if (!hasPermission) {
          // Pas de permission → rediriger vers Dashboard
          return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
        }
      }
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