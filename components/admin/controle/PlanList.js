'use client'
import React, { useState, useEffect } from "react";
import { MdAssignment, MdChevronRight, MdSlowMotionVideo } from "react-icons/md";

const PlanList = ({ onPlanSelect, selectedPlanId }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/admin/plan-action");
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] h-full border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
          <MdAssignment className="text-blue-500" /> PLANS D&apos;ACTIONS
        </h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Sélectionnez un dossier</p>
      </div>

      <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 flex-grow">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => onPlanSelect(plan.id)}
            className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between group
              ${selectedPlanId === plan.id 
                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20' 
                : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}`}
          >
            <div className="flex flex-col gap-1">
              <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedPlanId === plan.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {plan.workflow?.nom || 'Sans Workflow'}
              </span>
              <p className="text-sm font-bold truncate max-w-[150px]">{plan.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] bg-slate-900/50 px-2 py-0.5 rounded-md font-bold text-slate-300">
                  {plan._count?.actions || 0} Actions
                </span>
              </div>
            </div>
            <MdChevronRight className={`transition-transform ${selectedPlanId === plan.id ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} size={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanList;