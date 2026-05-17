'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";

import { MdTimeline, MdAssignmentAdd } from "react-icons/md";
import AiActions from "@/components/admin/actions/AiActions";
import ManualActions from "@/components/admin/actions/ManualActions";

const Page = () => {
  const [activePlan, setActivePlan] = useState(null);

  // Initialize a plan if none exists for the current improvement cycle
  const createNewPlan = async () => {
    const res = await fetch("/api/admin/plan-action", {
      method: "POST",
      body: JSON.stringify({
        workflowId: 1, // This would normally come from your URL or State
        description: "Plan d'amélioration continue",
        dateDebut: new Date(),
      })
    });
    const data = await res.json();
    setActivePlan(data);
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
              Sélectionnez un plan pour commencer.
            </p>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
          {/* We pass the activePlan.id so actions are linked correctly */}
          <ManualActions planId={activePlan?.id} />
          <AiActions planId={activePlan?.id} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;