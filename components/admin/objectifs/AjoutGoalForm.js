'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MdClose, 
  MdOutlineTrackChanges, 
  MdOutlineFlag, 
  MdOutlineEvent, 
  MdOutlineDescription 
} from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";

const AjoutGoalForm = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Background Blur Overlay */}
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}  
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100"
              onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <MdOutlineTrackChanges className="text-2xl text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold">Nouvel objectif</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8 overflow-y-auto">
                
                {/* Section: Définition */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Définition de l&apos;objectif</h3>
                  <div className="grid gap-4">
                    <ModalInput 
                      icon={MdOutlineTrackChanges} 
                      label="Titre" 
                      placeholder="ex: Optimisation TRS Ligne B" 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ModalInput 
                        icon={MdOutlineFlag} 
                        label="Cible" 
                        placeholder="ex: 85% ou -15min" 
                      />
                      <ModalInput 
                        icon={MdOutlineEvent} 
                        label="Échéance" 
                        type="date"
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Détails */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Détails & Contexte</h3>
                  <div className="flex gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:border-blue-500 transition-all">
                    <MdOutlineDescription className="text-2xl text-slate-400 mt-1" />
                    <textarea 
                      className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300 min-h-[120px] resize-none"
                      placeholder="Décrivez les étapes ou la méthodologie (ex: Méthode SMED, Analyse des causes...)"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button 
                  onClick={onClose} 
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <IoReturnUpBack size={20}/> Annuler
                </button>
                <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <HiPlus size={20}/> Créer l&apos;Objectif
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* Reusable Styled Input */
const ModalInput = ({ icon: Icon, label, ...props }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
    <Icon className="text-2xl text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase  tracking-widest">{label}</label>
      <input
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300"
        {...props} 
      />
    </div>
  </div>
);

export default AjoutGoalForm;