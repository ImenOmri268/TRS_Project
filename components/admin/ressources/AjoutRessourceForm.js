'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSettings, MdAnalytics, MdCheckCircle, MdMemory, MdCategory } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";

const AjoutRessourceForm = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Background Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />

          {/* Form Slide-in */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 "
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
                <h2 className="text-xl font-bold ">Nouvelle Ressource</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8">
                {/* Identification */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Identification</h3>
                  <div className="grid gap-4">
                    <ModalInput icon={MdMemory} label="Nom de la Ressource" placeholder="ex: Machine Laser 05" />
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
                      <MdCategory className="text-2xl text-slate-400" />
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type de Collection</label>
                        <select className="w-full bg-transparent text-slate-900 font-medium focus:outline-none appearance-none cursor-pointer">
                          <option value="machine">Machine</option>
                          <option value="employe">Employé</option>
                          <option value="outil">Outil</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Initial Thresholds */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Seuils Initiaux (%)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ModalInput icon={MdSettings} label="Disponibilité" placeholder="0" type="number" />
                    <ModalInput icon={MdAnalytics} label="Performance" placeholder="0" type="number" />
                    <ModalInput icon={MdCheckCircle} label="Qualité" placeholder="0" type="number" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <HiPlus /> Créer la Ressource
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalInput = ({ icon: Icon, label, ...props }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
    <Icon className="text-2xl text-slate-400" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" 
        {...props} 
      />
    </div>
  </div>
);

export default AjoutRessourceForm;