'use client';
import React from "react";
import { FiX, FiCalendar, FiInfo } from "react-icons/fi";

const ActionDetailsDrawer = ({ action, isOpen, onClose, priorityStyle, statusStyle }) => {
  if (!action) return null;

  return (
    <>
      {/* Backdrop overlay background */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-100 shadow-2xl z-50 transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FiInfo className="text-slate-400" size={18} />
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Détails de l'Action</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-76px)] custom-scrollbar">
          {/* Title Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Intitulé</span>
            <h4 className="text-lg font-bold text-slate-800 leading-snug">{action.title}</h4>
          </div>

          {/* Badges Layout GRID */}
          <div className="grid grid-cols-2 gap-4 border-y border-slate-100/80 py-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Priorité</span>
              <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-md uppercase tracking-wide ${priorityStyle[action.priorite] || 'bg-slate-100 text-slate-600'}`}>
                {action.priorite}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Statut Actuel</span>
              <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-full uppercase tracking-wide ${statusStyle[action.statut] || 'bg-slate-100 text-slate-700'}`}>
                {action.statut ? action.statut.replace('_', ' ') : ''}
              </span>
            </div>
          </div>

          {/* Date section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Échéance de traitement</span>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-bold font-mono bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 w-fit">
              <FiCalendar className="text-slate-400" size={16} />
              {action.dateLimite 
                ? new Date(action.dateLimite).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : 'Non spécifiée'
              }
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Consignes & Description</span>
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
              {action.description || 'Aucune consigne rédigée.'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionDetailsDrawer;