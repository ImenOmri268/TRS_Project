'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFlag, MdInfoOutline } from "react-icons/md";

const GoalDetails = ({ selectedGoal, onClose }) => {
  return (
    <AnimatePresence>
      {selectedGoal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm h-full z-50" />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-60 flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
                  <MdFlag size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800">Détails de l&apos;Objectif</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><MdClose size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ressource</span>
                <h4 className="text-xl font-bold text-slate-900 leading-tight">{selectedGoal.ressource?.nom || "Machine"}</h4>
              </div>
              <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <MdInfoOutline className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 uppercase">titre de l&apos;objectif:</span>
                  <p className="text-slate-900 text-sm leading-relaxed font-medium ">{selectedGoal.title}</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-4xl border border-slate-100 space-y-4">
                 
                <div className="flex items-center gap-3">
                  <MdInfoOutline className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 uppercase">description:</span>
                </div>
                <p className="text-slate-900 text-sm leading-relaxed font-medium  ">{selectedGoal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 ">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <MdInfoOutline className="text-slate-400" />
                      <p className="text-sm font-bold text-slate-500 uppercase mb-1">cible</p>
                   </div> 
                   <p className="text-xl font-black text-slate-800">{selectedGoal.valeurCible}%</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3">
                      <MdInfoOutline className="text-slate-400" />
                      <p className="text-sm font-bold text-slate-500 uppercase mb-1">Échéance</p>
                   </div> 
                   <p className="text-xl font-black text-slate-800">
                    {selectedGoal.dateFin ? new Date(selectedGoal.dateFin).toLocaleDateString() : '—'}
                   </p>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-100 bg-slate-50/30">
              <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg">Fermer</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalDetails;