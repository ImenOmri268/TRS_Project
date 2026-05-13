'use client'
import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddRessourceAction from "@/components/admin/ressources/AddRessourceAction";
import TableRessources from "@/components/admin/ressources/TableRessources";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { MdRefresh } from "react-icons/md";

export default function Page() {
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from your new API
  const fetchRessources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ressources');
      if (res.ok) {
        const data = await res.json();
        setRessources(data);
      } else {
        console.error("Erreur lors de la récupération des ressources");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRessources();
  }, [fetchRessources]);

  return (
    <AdminLayout activePage="Gestion des Ressources">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* Page Header */}
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
          
          <div className="flex items-center gap-3">
             {/* Refresh Button */}
             <button 
              onClick={fetchRessources}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
              title="Actualiser"
            >
              <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Add Action - Passing refresh to trigger re-fetch after creation */}
            <AddRessourceAction refresh={fetchRessources} /> 
          </div>
        </div>
        
        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden min-h-[400px] relative">
          {loading && ressources.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Chargement...</p>
              </div>
            </div>
          ) : (
            <TableRessources 
              ressources={ressources} 
              refresh={fetchRessources} 
            />
          )}

          {!loading && ressources.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-400 italic">Aucune ressource trouvée. Commencez par en ajouter une.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}