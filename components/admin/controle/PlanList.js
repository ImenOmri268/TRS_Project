'use client'
import React, { useState, useEffect } from "react";
import { MdAssignment, MdChevronRight, MdDeleteOutline } from "react-icons/md";
import PlanDetailsSidebar from "./PlanDetailsSidebar"; // Adjust path dynamically based on directory structure

const PlanList = ({ onPlanSelect, selectedPlanId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sidebar visibility controls
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailedPlan, setDetailedPlan] = useState(null);

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

  const handleDeletePlan = async (e, planId) => {
    e.stopPropagation();
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plan d'action ?")) return;

    try {
      const res = await fetch(`/api/admin/plan-action?id=${planId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.id !== planId));
        if (selectedPlanId === planId) {
          onPlanSelect(null);
        }
        if (detailedPlan?.id === planId) {
          setSidebarOpen(false);
          setDetailedPlan(null);
        }
      } else {
        alert("Erreur lors de la suppression du plan.");
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Une erreur est survenue.");
    }
  };

  // Explicit side Drawer initialization command handler
  const handleOpenDetails = (e, plan) => {
    e.stopPropagation(); // Stops core selection row active switches
    setDetailedPlan(plan);
    setSidebarOpen(true);
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
          Sélectionnez un dossier ou inspectez les détails
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
              onClick={() => onPlanSelect(plan.id)}
              className={`w-full group rounded-2xl border transition-all flex items-center justify-between p-3 sm:p-4 gap-2 cursor-pointer
                ${selectedPlanId === plan.id 
                  ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' 
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'}`}
            >
              {/* Info Column Description Node Area */}
              <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                
                
                <p className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white truncate max-w-[160px] xs:max-w-[220px] sm:max-w-xs md:max-w-[180px] lg:max-w-[140px] xl:max-w-[200px]">
                  {plan.title}
                </p>
                
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold backdrop-blur-sm
                    ${selectedPlanId === plan.id ? 'bg-blue-700/60 text-blue-100' : 'bg-slate-950/50 text-slate-400'}`}>
                    {plan._count?.actions || 0} Actions
                  </span>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* UPGRADED CHEVRON: Now an explicit clickable details drawer trigger button */}
                <button
                  onClick={(e) => handleOpenDetails(e, plan)}
                  title="Voir les détails complets"
                  className={`p-2 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95
                    ${selectedPlanId === plan.id ? 'hover:bg-blue-700/50' : 'hover:bg-slate-700/40'}`}
                >
                  <MdChevronRight className="transition-transform group-hover:translate-x-0.5" size={22} />
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={(e) => handleDeletePlan(e, plan.id)}
                  title="Supprimer le plan d'action"
                  className={`p-2 rounded-xl transition-all text-slate-400 hover:text-rose-400 active:scale-95
                    ${selectedPlanId === plan.id 
                      ? 'hover:bg-blue-700/50 hover:text-rose-200' 
                      : 'hover:bg-slate-700/40'}`}
                >
                  <MdDeleteOutline size={18} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* RENDER SIDEBAR DRAWER PANEL */}
      <PlanDetailsSidebar 
        plan={detailedPlan} 
        isOpen={sidebarOpen} 
        onClose={() => {
          setSidebarOpen(false);
          setDetailedPlan(null);
        }} 
      />
    </div>
  );
};

export default PlanList;