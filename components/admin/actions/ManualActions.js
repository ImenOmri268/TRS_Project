'use client'
import React, { useState, useEffect } from "react";
import { MdAssignmentAdd, MdDescription, MdSettings } from "react-icons/md";

const CreatePlanForm = ({ onPlanCreated }) => {
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [resources, setResources] = useState([]);
  const [fetchingWorkflows, setFetchingWorkflows] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(true);
  
  const [planData, setPlanData] = useState({
    description: "",
    ressourceId: "",
    workflowId: "", 
    dateDebut: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/admin/ressources");
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des ressources:", err);
      } finally {
        setFetchingResources(false);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    const fetchWorkflowsForResource = async () => {
      if (!planData.ressourceId) {
        setWorkflows([]);
        setPlanData(prev => ({ ...prev, workflowId: "" }));
        return;
      }

      setFetchingWorkflows(true);
      try {
        const response = await fetch(`/api/admin/workflow?ressourceId=${planData.ressourceId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkflows(data);
          setPlanData(prev => ({ ...prev, workflowId: "" }));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des workflows dépendants:", err);
      } finally {
        setFetchingWorkflows(false);
      }
    };

    fetchWorkflowsForResource();
  }, [planData.ressourceId]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!planData.ressourceId) return alert("Veuillez sélectionner une ressource.");
    if (!planData.workflowId) return alert("Veuillez sélectionner un workflow.");
    
    setLoading(true);
    try {
      const response = await fetch("/api/admin/plan-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...planData,
          workflowId: parseInt(planData.workflowId),
          ressourceId: parseInt(planData.ressourceId)
        }),
      });

      if (response.ok) {
        const newPlan = await response.json();
        if (typeof onPlanCreated === "function") {
          onPlanCreated(newPlan);
        }

        alert("Plan d'action initialisé avec succès !");
        setPlanData({ 
          description: "", 
          ressourceId: "", 
          workflowId: "", 
          dateDebut: new Date().toISOString().split('T')[0] 
        });
      }
    } catch (err) {
      console.error("Erreur creation plan:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      {/* HEADER SECTION: Text auto-wraps cleanly on ultra-small mobile displays */}
      <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-100">
         <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <MdAssignmentAdd className="text-blue-600 flex-shrink-0" size={24} /> 
            <span className="break-words">Nouveau Plan d&apos;Action</span>
         </h3>
         <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
           Initialiser les actions correctives basées sur une analyse.
         </p>
      </div>

      {/* FORM CORE CONTAINER */}
      <form onSubmit={handleCreatePlan} className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-5">
          
          {/* GRIDS: 1 column on mobile layout structures, 2 columns on tablet/desktop layout lines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* SELECT RESOURCE */}
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Sélectionner la ressource (à suivre)
              </label>
              <div className="relative">
                <select 
                  required
                  value={planData.ressourceId}
                  onChange={(e) => setPlanData({...planData, ressourceId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700 pr-12 truncate"
                >
                  <option value="">{fetchingResources ? "Chargement..." : "-- Choisir une ressource --"}</option>
                  {resources.map((rs) => (
                    <option key={rs.id} value={rs.id}>
                      {rs.nom}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-slate-50 pl-1">
                  <MdSettings size={18} className={fetchingResources ? "animate-spin text-blue-500" : ""} />
                </div>
              </div>
            </div>

            {/* SELECT WORKFLOW */}
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Sélectionner le Workflow (Analyse)
              </label>
              <div className="relative">
                <select 
                  required
                  disabled={!planData.ressourceId || fetchingWorkflows}
                  value={planData.workflowId}
                  onChange={(e) => setPlanData({...planData, workflowId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700 pr-12 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed truncate"
                >
                  {!planData.ressourceId ? (
                    <option value="">-- Choisir d&apos;abord une ressource --</option>
                  ) : fetchingWorkflows ? (
                    <option value="">Chargement des analyses...</option>
                  ) : workflows.length === 0 ? (
                    <option value="">Aucun workflow trouvé</option>
                  ) : (
                    <>
                      <option value="">-- Choisir un workflow --</option>
                      {workflows.map((wf) => (
                        <option key={wf.id} value={wf.id}>
                          {wf.nom} ({wf.statut})
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-slate-50 pl-1">
                  <MdSettings size={18} className={fetchingWorkflows ? "animate-spin text-blue-500" : ""} />
                </div>
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
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-sm min-h-[100px] sm:min-h-[120px] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 placeholder:text-slate-300 resize-y"
              />
              <MdDescription className="absolute right-4 bottom-4 text-slate-200 pointer-events-none hidden sm:block" size={24} />
            </div>
          </div>

          {/* DATE DE LANCEMENT */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Date de lancement
            </label>
            <div className="relative">
              <input 
                type="date"
                required
                value={planData.dateDebut}
                onChange={(e) => setPlanData({...planData, dateDebut: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT ACTION CONTROLLER */}
        <div className="pt-4 mt-auto">
          <button 
            type="submit"
            disabled={loading || fetchingWorkflows || !planData.workflowId}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-35 disabled:bg-slate-800 disabled:cursor-not-allowed shadow-lg shadow-slate-100 uppercase text-[11px] sm:text-xs tracking-[0.15em]"
          >
            {loading ? "Initialisation..." : "Lancer le Plan d'Action"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlanForm;