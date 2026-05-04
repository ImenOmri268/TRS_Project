'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSave } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const GoalEdit = ({ editingGoal, onClose }) => {
  return (
    <AnimatePresence>
      {editingGoal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0  bg-slate-900/40 backdrop-blur-sm z-[70] h-full" />

            
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col">

            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Modifier l&apos;Objectif</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><MdClose size={24} /></button>
            </div>
            <form className="flex-1 p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nom de l&apos;objectif</label>
                <input type="text" defaultValue={editingGoal.title} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valeur Cible</label>
                  <input type="text" defaultValue={editingGoal.target} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Statut</label>
                  <select defaultValue={editingGoal.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
                    <option>En Cours</option>
                    <option>Atteint</option>
                    <option>Non Commencé</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                <textarea defaultValue={editingGoal.description} rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none" />
              </div>
            </form>
            <div className="sticky bottom-0 p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                <IoReturnUpBack /> Annuler
              </button>
              <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                <MdSave size={20} /> Enregistrer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalEdit;