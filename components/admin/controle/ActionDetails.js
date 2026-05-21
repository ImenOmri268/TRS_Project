'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEvent, MdPriorityHigh, MdAnalytics, MdAssignment, MdPerson, MdAssignmentTurnedIn } from "react-icons/md";

const ActionDetails = ({ selectedAction, onClose }) => {
  if (!selectedAction) return null;

  // Helper utility to safely format ISO strings inside the panel preview cards
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Helper utility to map technical status enums to custom theme classes
  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "A_FAIRE":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "EN_COURS":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "TERMINE":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "EN_RETARD":
        return "bg-rose-50 text-rose-700 border-rose-100 animate-pulse";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "A_FAIRE": return "À faire";
      case "EN_COURS": return "En cours";
      case "TERMINE": return "Terminé";
      case "EN_RETARD": return "En retard";
      default: return status;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Détails de l&apos;Action</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Content Wrapper */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            
            {/* STATUS & MISSION TITLE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Titre de la mission</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyles(selectedAction.statut)}`}>
                  {getStatusLabel(selectedAction.statut)}
                </span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 leading-tight">{selectedAction.title || "Sans titre"}</h4>
            </div>

            {/* CORE META GRID: DATE & PRIORITY */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <MdEvent size={14} /> Date Limite
                </div>
                <p className="text-xs font-bold text-slate-700">
                  {formatDisplayDate(selectedAction.dateLimite)}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                  <MdPriorityHigh size={14} /> Priorité
                </div>
                <span className={`inline-block text-xs font-extrabold uppercase tracking-wide ${
                  selectedAction.priorite === 'HAUT' ? 'text-rose-600' : selectedAction.priorite === 'MOYEN' ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  {selectedAction.priorite || "MOYEN"}
                </span>
              </div>
            </div>

            {/* TRS ESTIMATE METRIC PANEL */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm text-blue-600">
                  <MdAnalytics size={18} />
                </div>
                <span className="text-xs font-bold text-slate-600">Impact TRS estimé</span>
              </div>
              <span className="text-lg font-black text-blue-700">
                {selectedAction.impactTrs !== null && selectedAction.impactTrs !== undefined ? `${selectedAction.impactTrs}%` : "0%"}
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* SOURCE WORKFLOW BLUEPRINT / PLAN D'ACTION */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MdAssignment size={14} /> Plan d&apos;action d&apos;origine
              </h5>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <p className="text-sm font-semibold text-slate-700">
                  {selectedAction.plan?.description || "Plan d'action global référencé"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">ID Réf: #{selectedAction.planId}</p>
              </div>
            </div>

            {/* ASSIGNED OPERATOR IN CHARGE */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MdPerson size={14} /> Collaborateur Responsable
              </h5>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                <div className="h-9 w-9 bg-slate-200 text-slate-600 font-bold text-xs uppercase flex items-center justify-center rounded-xl">
                  {selectedAction.user?.name ? selectedAction.user.name.substring(0, 2) : "OP"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedAction.user?.name || "Non assigné"}</p>
                  <p className="text-xs text-slate-400 font-medium">{selectedAction.user?.email || "Pas de courriel disponible"}</p>
                </div>
              </div>
            </div>

            {/* TEXT DESCRIPTION BOX */}
            <div className="space-y-2">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <MdAssignmentTurnedIn size={14} /> Description & Contexte
              </h5>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
                {selectedAction.description ? selectedAction.description : (
                  <span className="italic text-slate-400">Aucune description supplémentaire fournie pour cette action corrective.</span>
                )}
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/30">
            <button 
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 text-sm"
              onClick={onClose}
            >
              Fermer l&apos;aperçu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActionDetails;