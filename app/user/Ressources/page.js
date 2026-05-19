'use client'
import React, { useState, useEffect, useCallback } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import TableRessources from "@/components/user/ressources/TableRessources";
import AjoutRessourceForm from "@/components/admin/ressources/AjoutRessourceForm";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { usePermissions } from "@/app/lib/hooks/usePermissions";

export default function Page() {
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { can } = usePermissions();

  const fetchRessources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/ressources');
      if (res.ok) {
        const data = await res.json();
        setRessources(data);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRessources(); }, [fetchRessources]);

  return (
    <UserLayout activePage="Ressources">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <HiOutlineCpuChip className="text-blue-600" />
              GESTION DES RESSOURCES
            </h1>
            <p className="text-slate-500 font-medium">
              Supervisez la performance et l&apos;état opérationnel de vos machines.
            </p>
          </div>
          {can('ajouter_ressource') && (
            <AjoutButton setIsOpen={setIsOpen} title="Ajouter une ressource" />
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[400px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : ressources.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-slate-400 italic">Aucune ressource trouvée.</p>
            </div>
          ) : (
            <TableRessources
              ressources={ressources}
              refresh={fetchRessources}
              canModifier={can('modifier_ressource')}
              canSupprimer={can('supprimer_ressource')}
            />
          )}
        </div>

        {can('ajouter_ressource') && (
          <AjoutRessourceForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            refresh={fetchRessources}
            apiUrl="/api/user/ressources"
          />
        )}
      </div>
    </UserLayout>
  );
}