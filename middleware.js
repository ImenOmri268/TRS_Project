import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'

const publicRoutes = ['/', '/SignUp', '/resetPassword', '/EmailSend']

// Pages user et leurs permissions requises
const userPagePermissions = {
  '/user/Dashboard'    : 'voir_dashboard',
  '/user/Objectifs'    : 'voir_objectifs',
  '/user/CollecteTRS'  : 'faire_collecte',
  '/user/Traitements'  : 'lancer_amelioration',
  '/user/PlanAction'   : 'voir_plan_action',
  '/user/Rapports'     : 'voir_rapport',
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

        // Redirection selon le type
        if (payload.type === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
        } else if (payload.type === 'USER') {
          return NextResponse.redirect(new URL('/user/Dashboard', request.url))
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
    // Un ADMIN ne peut pas accéder aux pages /user et vice versa
    if (payload.type === 'ADMIN') {
      if (pathname.startsWith('/user')) {
        return NextResponse.redirect(new URL('/admin/Dashboard', request.url))
      }
      return NextResponse.next()
    }

    // USER → vérifier permissions selon la page
    if (payload.type === 'USER') {
      // Un USER ne peut pas accéder aux pages /admin
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/user/Dashboard', request.url))
      }

      // Vérifier la permission pour la page demandée
      const permissionRequise = userPagePermissions[pathname]
      if (permissionRequise) {
        const hasPermission = payload.permissions?.includes(permissionRequise)
        if (!hasPermission) {
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