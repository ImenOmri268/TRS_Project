'use client'
import React, { useState, useEffect } from "react";
import { MdAssignmentAdd, MdDescription, MdEvent, MdSettings } from "react-icons/md";

const CreatePlanForm = ({ onPlanCreated }) => {
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [fetchingWorkflows, setFetchingWorkflows] = useState(true);
  
  const [planData, setPlanData] = useState({
    description: "",
    workflowId: "", 
    dateDebut: new Date().toISOString().split('T')[0]
  });

  // Fetch workflows created by admin
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch("/api/admin/workflow"); // We'll create/update this route
        if (response.ok) {
          const data = await response.json();
          setWorkflows(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des workflows:", err);
      } finally {
        setFetchingWorkflows(false);
      }
    };
    fetchWorkflows();
  }, []);

  const handleCreatePlan = async (e) => {
  e.preventDefault();
  if (!planData.workflowId) {
    alert("Veuillez sélectionner un workflow.");
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch("/api/admin/plan-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...planData,
        workflowId: parseInt(planData.workflowId) // Ensure ID is a number
      }),
    });

    if (response.ok) {
      const newPlan = await response.json();
      
      // Safety check: only call if the function exists
      if (typeof onPlanCreated === "function") {
        onPlanCreated(newPlan);
      }

      alert("Plan d'action initialisé avec succès !");
      setPlanData({ description: "", workflowId: "", dateDebut: new Date().toISOString().split('T')[0] });
    }
  } catch (err) {
    console.error("Erreur creation plan:", err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="bg-slate-50 p-4 border-b border-slate-100">
         <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <MdAssignmentAdd className="text-blue-600" size={24} /> Nouveau Plan d&apos;Action
         </h3>
         <p className="text-xs text-slate-500 font-medium mt-1">Initialiser les actions correctives basées sur une analyse.</p>
      </div>

      <form onSubmit={handleCreatePlan} className="p-5 space-y-6">
        <div className="space-y-5">
          
          {/* SELECT WORKFLOW */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Sélectionner le Workflow (Analyse)
            </label>
            <div className="relative">
              <select 
                required
                value={planData.workflowId}
                onChange={(e) => setPlanData({...planData, workflowId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
              >
                <option value="">{fetchingWorkflows ? "Chargement..." : "-- Choisir un workflow --"}</option>
                {workflows.map((wf) => (
                  <option key={wf.id} value={wf.id}>
                    {wf.nom} ({new Date(wf.dateDebut).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <MdSettings size={18} className="animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* OBJECTIF DU PLAN */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Objectif du plan
            </label>
            <div className="relative">
              <textarea 
                required
                placeholder="Quelle est la finalité de ce plan ?"
                value={planData.description}
                onChange={(e) => setPlanData({...planData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm min-h-[120px] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 placeholder:text-slate-300"
              />
              <MdDescription className="absolute right-4 bottom-4 text-slate-200" size={24} />
            </div>
          </div>

          {/* DATE DE DÉBUT */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Date de lancement
            </label>
            <div className="relative">
              <input 
                type="date"
                value={planData.dateDebut}
                onChange={(e) => setPlanData({...planData, dateDebut: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || fetchingWorkflows}
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-30 shadow-lg shadow-slate-100 uppercase text-xs tracking-[0.2em]"
        >
          {loading ? "Initialisation..." : "Lancer le Plan d'Action"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlanForm;