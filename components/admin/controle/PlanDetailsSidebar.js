'use client'
import React, { useEffect } from "react";
import { MdClose, MdAssignment, MdDescription, MdAccessTime, MdTrendingUp } from "react-icons/md";

const PlanDetailsSidebar = ({ plan, isOpen, onClose }) => {
  // Handle Escape key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!plan) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 text-slate-800 shadow-2xl z-50 transition-transform duration-300 ease-out p-6 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <MdAssignment size={24} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wide text-slate-800">Détails du Plan</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: #{plan.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200/60 hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-all"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-6 space-y-6 flex-grow overflow-y-auto pr-1 dynamic-scrollbar">
          
          {/* Plan Title Attribute */}
          <div className="space-y-2 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
              <MdTrendingUp size={14} /> Titre du plan
            </label>
            <h4 className="text-base font-bold text-slate-800 leading-snug">
              {plan.title || "Aucun titre spécifié"}
            </h4>
          </div>

          {/* Workflow Related Meta */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Workflow associé</label>
            <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 border border-slate-200 text-slate-600 uppercase tracking-wide">
              {plan.workflow?.nom || 'Sans Workflow'}
            </span>
          </div>

          {/* Description / Objectif */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MdDescription size={14} /> Objectif & Description
            </label>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/40 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
              {plan.description}
            </p>
          </div>

          {/* Timing Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <MdAccessTime size={12} /> Date Début
              </label>
              <p className="text-xs font-bold text-slate-700">
                {plan.dateDebut ? new Date(plan.dateDebut).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
          </div>

        </div>
        
        {/* Actions Total Badge Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>Total des tâches rattachées</span>
          <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-slate-700 font-black">
            {plan._count?.actions || 0} Actions
          </span>
        </div>
      </div>
    </>
  );
};

export default PlanDetailsSidebar;