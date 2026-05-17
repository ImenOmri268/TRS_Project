'use client'
import React, { useState } from "react";
import { MdAssignmentAdd, MdDescription, MdEvent } from "react-icons/md";

const CreatePlanForm = ({ onPlanCreated }) => {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState({
    description: "",
    workflowId: "", // Should be linked to your current analysis
    dateDebut: new Date().toISOString().split('T')[0]
  });

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin/plan-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        const newPlan = await response.json();
        onPlanCreated(newPlan); // Passes the new plan (and its ID) to the parent
        alert("Plan d'action initialisé avec succès !");
      }
    } catch (err) {
      console.error("Erreur creation plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">


      <form onSubmit={handleCreatePlan} className="p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">ID DU WORKFLOW (ANALYSE)</label>
            <input 
              required
              type="number"
              placeholder="Ex: 1"
              value={planData.workflowId}
              onChange={(e) => setPlanData({...planData, workflowId: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">OBJECTIF DU PLAN</label>
            <textarea 
              required
              placeholder="Description du plan (ex: Amélioration TRS Machine B2)..."
              value={planData.description}
              onChange={(e) => setPlanData({...planData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">DATE DE DÉBUT</label>
            <input 
              type="date"
              value={planData.dateDebut}
              onChange={(e) => setPlanData({...planData, dateDebut: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
        >
          {loading ? "Création..." : "Lancer le Plan"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlanForm;