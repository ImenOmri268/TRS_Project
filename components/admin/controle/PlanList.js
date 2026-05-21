'use client'
import React, { useState, useEffect } from "react";
import { MdAssignment, MdChevronRight, MdDeleteOutline } from "react-icons/md";

const PlanList = ({ onPlanSelect, selectedPlanId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all plans
  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plan-action");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (err) {
      console.error("Erreur chargement des plans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Delete individual plan handle
  const handleDeletePlan = async (e, planId) => {
    e.stopPropagation(); // Prevents triggering onPlanSelect when clicking delete
    
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan d'action ?")) return;

    try {
      const res = await fetch(`/api/admin/plan-action?id=${planId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Optimistically update UI or refresh data
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
        // If the deleted plan was currently selected, reset it
        if (selectedPlanId === planId) {
          onPlanSelect(null);
        }
      } else {
        alert("Erreur lors de la suppression du plan.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] h-full border border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[400px]">
      
      {/* HEADER CONTROLS */}
      <div className="mb-5 sm:mb-6">
        <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
          <MdAssignment className="text-blue-500 flex-shrink-0" size={20} /> 
          <span>PLANS D&apos;ACTIONS</span>
        </h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
          Sélectionnez un dossier
        </p>
      </div>

      {/* PLAN SCROLL GRID LIST */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-grow max-h-[500px] lg:max-h-none dynamic-scrollbar">
        {loading ? (
          <div className="text-center py-8 text-slate-500 text-sm font-medium animate-pulse">
            Chargement des plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm font-medium">
            Aucun plan d&apos;action trouvé.
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className={`w-full group rounded-2xl border transition-all flex items-center justify-between p-3 sm:p-4 gap-2 
                ${selectedPlanId === plan.id 
                  ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'}`}
            >
              {/* Main Interactive Button Area */}
              <button
                onClick={() => onPlanSelect(plan.id)}
                className="flex-1 text-left flex items-center justify-between min-w-0"
              >
                <div className="flex flex-col gap-1 min-w-0 pr-2">
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider truncate
                    ${selectedPlanId === plan.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {plan.workflow?.nom || 'Sans Workflow'}
                  </span>
                  
                  {/* Fluid Responsive Text Truncation Thresholds */}
                  <p className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white truncate max-w-[180px] xs:max-w-[240px] sm:max-w-xs md:max-w-[200px] lg:max-w-[160px] xl:max-w-[220px]">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold backdrop-blur-sm
                      ${selectedPlanId === plan.id ? 'bg-blue-700/60 text-blue-100' : 'bg-slate-950/50 text-slate-400'}`}>
                      {plan._count?.actions || 0} Actions
                    </span>
                  </div>
                </div>

                {/* Desktop Chevron helper visual indicator */}
                <MdChevronRight 
                  className={`hidden sm:block transition-transform flex-shrink-0
                    ${selectedPlanId === plan.id ? 'translate-x-1 text-white' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} 
                  size={20} 
                />
              </button>

              {/* ISOLATED RESPONSIVE DELETE INTERACTIVE CAP */}
              <button
                onClick={(e) => handleDeletePlan(e, plan.id)}
                title="Supprimer le plan d'action"
                className={`p-2 rounded-xl transition-all flex-shrink-0 text-slate-400 hover:text-rose-400 active:scale-95
                  ${selectedPlanId === plan.id 
                    ? 'hover:bg-blue-700/50 hover:text-rose-200' 
                    : 'hover:bg-slate-700/40'}`}
              >
                <MdDeleteOutline size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlanList;