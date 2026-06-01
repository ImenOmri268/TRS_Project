'use client';
import React from "react";

const ListePlansGauche = ({ plans, planSelectionne, onSelectPlan }) => {
  
  const statusColors = {
    EN_COURS: "border-l-blue-500 bg-blue-50/20 text-blue-700",
    TERMINE: "border-l-emerald-500 bg-emerald-50/20 text-emerald-700",
    A_FAIRE: "border-l-slate-400 bg-slate-50/50 text-slate-600",
    EN_RETARD: "border-l-rose-500 bg-rose-50/30 text-rose-700 font-bold"
  };

  return (
    <div className="w-full space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
        Mes Plans Assignés ({plans.length})
      </p>
      
      {plans.map((p) => {
        const isSelected = planSelectionne?.id === p.id;
        const totalActions = p.actions.length;
        const actionsTerminees = p.actions.filter(a => a.statut === 'TERMINE').length;

        return (
          <div
            key={p.id}
            onClick={() => onSelectPlan(p)}
            className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden group select-none
              ${isSelected 
                ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10' 
                : 'bg-white border-slate-100 hover:border-slate-300 text-slate-800 hover:bg-slate-50/50'
              }`}
          >

            <div className="pl-1">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                  {p.ressourceNom}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {actionsTerminees}/{totalActions}
                </span>
              </div>

              

              {/* Barre de progression miniature */}
              <div className="w-full bg-slate-200/50 rounded-full h-1 mt-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${totalActions > 0 ? (actionsTerminees / totalActions) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListePlansGauche;