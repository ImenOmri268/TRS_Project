'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSave } from "react-icons/md";

const ActionEdit = ({ editingAction, onClose }) => {
  if (!editingAction) return null;

  return (
    <AnimatePresence>
      {editingAction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Modifier l&apos;Action</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                <MdClose size={24} />
              </button>
            </div>

            <form className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre</label>
                <input 
                  type="text" 
                  defaultValue={editingAction.title}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" defaultValue={editingAction.status}>
                    <option>A faire</option>
                    <option>En Cours</option>
                    <option>Terminé</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Impact (%)</label>
                  <input 
                    type="text" 
                    defaultValue={editingAction.impact}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priorité</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" defaultValue={editingAction.priority}>
                  <option>Haute</option>
                  <option>Moyenne</option>
                  <option>Basse</option>
                </select>
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 bg-slate-50/30">
              <button 
                type="button"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                onClick={onClose}
              >
                <MdSave size={20} /> Enregistrer les modifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionEdit;