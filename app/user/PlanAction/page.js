'use client'
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import ListePlansGauche from "@/components/user/planAction/ListePlansGauche";
import TableActionsDroite from "@/components/user/planAction/TableActionsDroite";
import { usePermissions } from "@/app/lib/hooks/usePermissions";
import { RiTodoLine } from "react-icons/ri";
import { FiLock } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { Toaster } from "react-hot-toast";


export default function PlanActionPage() {
  const [plans, setPlans] = useState([]);
  const [planSelectionne, setPlanSelectionne] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { can, loading: permissionsLoading } = usePermissions();

  const fetchPlanData = async (shouldMaintainSelectionId = null) => {
    try {
      const res = await fetch('/api/user/plan-action');
      if (res.ok) {
        const data = await res.json();
        const fetchPlans = data.plans || [];
        setPlans(fetchPlans);

        // Garder le même plan sélectionné après un refresh de statut
        if (fetchPlans.length > 0) {
          if (shouldMaintainSelectionId) {
            const current = fetchPlans.find(p => p.id === shouldMaintainSelectionId);
            setPlanSelectionne(current || fetchPlans[0]);
          } else {
            setPlanSelectionne(fetchPlans[0]); // Sélection par défaut du premier plan
          }
        } else {
          setPlanSelectionne(null);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du plan d'actions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && can('voir_plan_action')) {
      fetchPlanData();
    }
  }, [permissionsLoading]);

  // Handler pour rafraîchir les statuts sans perdre le focus du volet gauche
  const handleRefreshActions = () => {
    if (planSelectionne) {
      fetchPlanData(planSelectionne.id);
    }
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-xs font-black text-slate-400 tracking-widest uppercase">Initialisation du plan de travail...</div>
      </div>
    );
  }

  if (!can('voir_plan_action')) {
    return (
      <UserLayout >
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm max-w-2xl mx-auto mt-12">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
            <FiLock size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Accès Limité</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Votre compte ne dispose pas de l&apos;habilitation requise pour inspecter les plans d&apos;actions en cours.
          </p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout activePage="Plan d'actions">
      <Toaster position="top-center"  />
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* EN-TÊTE DE PAGE */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
            <RiTodoLine className="text-blue-600" size={28} />
            Mon Plan de Travail
          </h1>
          <p className="text-slate-400 text-xs ml-10">
            Consultez les correctifs et plans d&apos;actions qui vous ont été directement affectés sur vos machines.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
            Extraction de vos tâches courantes...
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 text-center py-20 space-y-2">
            <p className="text-slate-800 font-black text-lg">Aucune action assignée</p>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">Bonne nouvelle ! Vous n&apos;êtes actuellement ciblé par aucune intervention de maintenance corrective.</p>
          </div>
        ) : (
          /* STRUCTURE MASTER-DETAIL SPLIT SREEN */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* PARTIE GAUCHE : LISTE DES PLANS (Spans 4/12) */}
            <div className="lg:col-span-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xs h-full">
              <ListePlansGauche 
                plans={plans}
                planSelectionne={planSelectionne}
                onSelectPlan={setPlanSelectionne}
              />
            </div>

            {/* PARTIE DROITE : ACTIONS DU PLAN SÉLECTIONNÉ (Spans 8/12) */}
            <div className="lg:col-span-8 space-y-4">
              {planSelectionne && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-wider">
                    <MdClose /> Description globale du plan choisi
                  </div>
                  <p className="text-xs text-slate-600 font-medium italic">
                    {planSelectionne.description}
                  </p>
                </div>
              )}
              
              {planSelectionne && planSelectionne.actions.length > 0 ? (
                <TableActionsDroite 
                  actions={planSelectionne.actions}
                  refresh={handleRefreshActions}
                />
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-xs text-slate-400">
                  Sélectionnez un plan d&apos;action pour lister vos tâches associées.
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </UserLayout>
  );
}