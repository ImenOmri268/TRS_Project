'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import { MdTimeline } from "react-icons/md";
import AiActions from "@/components/admin/actions/AiActions";
import ManualActions from "@/components/admin/actions/ManualActions";

const Page = () => {
  const [activePlan, setActivePlan] = useState(null);

  // This is the missing function that the child component needs
  const handlePlanCreated = (newPlan) => {
    setActivePlan(newPlan);
  };

  return (
    <AdminLayout activePage="Plan d'actions">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdTimeline className="text-blue-600" />
              AMÉLIORATION CONTINUE
            </h1>
            <p className="text-slate-500 font-medium">
              {activePlan 
                ? `Plan actif : ${activePlan.description}` 
                : "Initialisez un plan pour commencer à ajouter des actions."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
          {/* ADD THE PROPS HERE */}
          <ManualActions 
            planId={activePlan?.id} 
            onPlanCreated={handlePlanCreated} 
          />
          <AiActions planId={activePlan?.id} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;