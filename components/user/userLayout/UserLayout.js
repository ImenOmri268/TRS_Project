'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { GoGoal } from "react-icons/go"
import { IoIosGitCompare } from "react-icons/io"
import { MdSettingsInputComponent } from "react-icons/md"
import SignOut from "@/components/authentification/SignOut"
import MenuButton from '../../../components/admin/adminLayout/MenuButton' 
import NotifButton from './notification/NotifButton'
import NotifBar from './notification/NotifBar'




const MENU_ITEMS = [
  { label: 'Dashboard',      href: '/user/Dashboard',     permission: 'voir_dashboard',      icon: '/dashboard.svg' },
  { label: 'Objectifs',      href: '/user/Objectifs',     permission: ['voir_objectifs', 'ajouter_objectif', 'modifier_objectif', 'supprimer_objectif'],      icon: <GoGoal className="w-5 h-5" /> },
  { label: 'Utilisateurs',   href: '/user/Utilisateurs',  permission: ['voir_utilisateurs', 'ajouter_utilisateur', 'modifier_utilisateur', 'supprimer_utilisateur'], icon: '/utilisateur.svg' },
  { label: 'Ressources',     href: '/user/Ressources',    permission: ['voir_ressources', 'ajouter_ressource', 'modifier_ressource', 'supprimer_ressource'],    icon: '/machine.svg' },
  { label: 'Collecte de données',   href: '/user/CollecteTRS', permission: 'faire_collecte',       icon: <MdSettingsInputComponent className="w-5 h-5" /> },
  { label: 'Suivi TRS',      href: '/user/SuiviTRS',    permission: 'suivre_trs',      icon: <IoIosGitCompare className="w-5 h-5" /> },
  { label: 'traitements',    href: '/user/Traitements', permission: ['consulter_traitements', 'generer_traitements'], icon: '/pipeline.svg' },
  { label: "Mes actions", href: '/user/PlanAction',  permission: 'voir_plan_action',    icon: '/plan.svg' },
]

export default function UserLayout({ children, activePage }) {
  const [profil, setProfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/user/profil')
      .then(res => res.json())
      .then(data => { setProfil(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const menuVisible = MENU_ITEMS.filter(item => {
    if (Array.isArray(item.permission)) {
      return item.permission.some(perm => profil?.permissions?.includes(perm))
    } else {
      return profil?.permissions?.includes(item.permission)
    }
  })

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse text-slate-400">Chargement...</div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-black">

      {/* Sidebar rétractable — même mécanique que l'admin */}
      <AnimatePresence>
        {!open && (
          <motion.nav
            initial={{ width: "280px", x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ width: 0, x: "-100%", opacity: 0 }}
            transition={{ duration: 0.266 }}
            className="bg-[#0F172A] text-slate-300 flex flex-col h-screen sticky top-0 overflow-hidden shrink-0 z-40"
          >
            {/* Nom du rôle */}
            <div className="p-6 text-[#3B82F6] font-bold text-2xl tracking-widest border-b border-slate-800">
              {profil?.userRole?.toUpperCase() ?? 'UTILISATEUR'}
            </div>

            {/* Nom + email */}
            <div className="px-6 py-3 border-b border-slate-800">
              <p className="text-slate-400 text-sm">{profil?.name}</p>
              <p className="text-slate-500 text-xs">{profil?.email}</p>
            </div>

            {/* Menu filtré selon permissions */}
            <div className="flex-1 overflow-y-auto py-4">
              {menuVisible.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                    pathname === item.href
                      ? 'bg-[#3B82F6] text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {typeof item.icon === 'string' ? (
                    <Image src={item.icon} alt={item.label} width={20} height={20} className="brightness-200" />
                  ) : item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Déconnexion */}
            <div className="p-4 border-t border-slate-800">
              <SignOut />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-4 md:px-8 bg-white border-b border-slate-200 top-0 z-30">
          <div className="flex items-center gap-4 w-full">
            <MenuButton open={open} setOpen={setOpen} />
            <div className="flex-1 flex items-center justify-end">
              
              {/* Conteneur RELATIVE pour aligner correctement la NotifBar sous la cloche */}
              <div className="relative">
                <NotifButton showNotif={showNotif} setShowNotif={setShowNotif} />
                <NotifBar showNotif={showNotif} setShowNotif={setShowNotif} />
              </div>

            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

    </div>
  )
}