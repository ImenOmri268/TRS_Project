'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdEvent, MdPriorityHigh, MdAnalytics, MdCategory } from "react-icons/md";

const ActionDetails = ({ selectedAction, onClose }) => {
  if (!selectedAction) return null;

  return (
    <AnimatePresence>
      {selectedAction && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50]"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col"
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Titre de la mission</span>
                <h4 className="text-2xl font-bold text-slate-900 leading-tight">{selectedAction.title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                    <MdEvent /> Date Limite
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{selectedAction.date}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                    <MdPriorityHigh /> Priorité
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{selectedAction.priority}</p>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                      <MdAnalytics />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Impact TRS estimé</span>
                  </div>
                  <span className="text-lg font-black text-emerald-600">{selectedAction.impact}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600">
                      <MdCategory />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Catégorie</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{selectedAction.category || "Standard"}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Description & Contexte</h5>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl italic">
                  &quot;Cette action vise à stabiliser les performances de la ligne en intervenant directement sur les causes racines identifiées lors de l&apos;analyse Ishikawa.&quot;
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              <button 
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                onClick={onClose}
              >
                Fermer l&apos;aperçu
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionDetails;