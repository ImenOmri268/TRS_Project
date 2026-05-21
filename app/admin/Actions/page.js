'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import { MdTimeline } from "react-icons/md";
import AiActions from "@/components/admin/actions/AiActions";
import ManualActions from "@/components/admin/actions/ManualActions";

const Page = () => {
  const [activePlan, setActivePlan] = useState(null);

  const handlePlanCreated = (newPlan) => {
    setActivePlan(newPlan);
  };

  return (
    <AdminLayout activePage="Plan d'actions">
      {/* - Changed p-8 to dynamic px-4 py-6 sm:p-8 to maximize screen width on phones
        - Swapped space-y-8 to space-y-6 sm:space-y-8 for a tighter mobile layout
      */}
      <div className="px-4 py-6 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
        
        {/* HEADER CONTROLLER: Stacks vertically on mobile, aligns horizontally on desktop */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pb-2 border-b border-slate-100 sm:border-0">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 sm:gap-3">
              <MdTimeline className="text-blue-600 flex-shrink-0" size={32} />
              <span className="truncate">AMÉLIORATION CONTINUE</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
              {activePlan 
                ? `Plan actif : ${activePlan.description}` 
                : "Initialisez un plan pour commencer à ajouter des actions."}
            </p>
          </div>
        </div>

        {/* LAYOUT MATRIX: 
          - Removed rigid h-[calc(100vh-250px)] height constraint to prevent layout breaking on mobile.
          - On lg screens, falls back to a clean grid layout.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
          <div className="w-full order-1">
            <ManualActions 
              planId={activePlan?.id} 
              onPlanCreated={handlePlanCreated} 
            />
          </div>
          
          <div className="w-full order-2">
            <AiActions planId={activePlan?.id} />
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;