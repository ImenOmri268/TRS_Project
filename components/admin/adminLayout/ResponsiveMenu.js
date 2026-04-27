import React from "react";
import SignOut from "../../authentification/SignOut";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { GoGoal } from "react-icons/go";
import { IoIosGitCompare } from "react-icons/io";

const ResponsiveMenu = ({ open, page }) => {
  const menuItems = [
    { name: "Dashboard", href: "/admin/Dashboard", icon: "/dashboard.svg" },
    { name: "Les Objectifs", href: "/admin/Objectifs", icon: <GoGoal className="w-5 h-5" /> },
    { name: "Liste des utilisateurs", href: "/admin/Utilisateurs", icon: "/utilisateur.svg" },
    { name: "Gestion des Ressources", href: "/admin/Ressources", icon: "/machine.svg" },
    { name: "Suivi-TRS", href: "/admin/Suivi-TRS", icon: <IoIosGitCompare className="w-5 h-5" /> },
    { name: "Traitements", href: "/admin/Traitements", icon: "/pipeline.svg" },
    { name: "Plan d'actions", href: "/admin/Actions", icon: "/plan.svg" },
    { name: "Contrôle", href: "/admin/Controle", icon: "/controle.svg" },
  ];

  return (
    <AnimatePresence>
      {!open && (
        <motion.nav
          initial={{width:"280px", x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{width:0, x: "-100%", opacity: 0 }}
          transition={{ duration: 0.266 }}
          className="bg-[#0F172A] text-slate-300 flex flex-col h-screen sticky  top-0 overflow-hidden shrink-0 z-40  "
        >
          <div className="p-6 text-[#3B82F6] font-bold text-2xl tracking-widest border-b border-slate-800">
            ADMIN
          </div>

          <div className="flex-1 overflow-y-auto py-4 ">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  page === item.name 
                  ? "bg-[#3B82F6] text-white" 
                  : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                {typeof item.icon === 'string' ? (
                  <Image src={item.icon} alt={item.name} width={20} height={20} className="brightness-200" />
                ) : item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800">
            <SignOut />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;