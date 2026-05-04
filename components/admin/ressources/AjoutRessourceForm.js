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
                    <ModalInput icon={MdCategory} label="Type de Ressource" placeholder="ex: Machine, Outil, Personnel..." /> 
                  </div>
                </div>
                
                

                {/* TRS Initial */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">TRS initial (%)
                    <span className="text-xs font-normal text-slate-400 lowercase tracking-tight ml-2">s&apos;il ya un trs initial</span>
                  </h3>
                  <ModalInput icon={MdSettings}  placeholder="Entrer votre TRS initial si tu as un" type="number" />
                </div>
                {/* Initial Thresholds */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Seuils Initiaux (%)
                    <span className="text-xs font-normal text-slate-400 lowercase tracking-tight ml-2">s&apos;il ya des valeurs initials</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ModalInput icon={MdSettings}  placeholder="Disponibilité" type="number" />
                    <ModalInput icon={MdAnalytics}  placeholder="Performance" type="number" />
                    <ModalInput icon={MdCheckCircle}  placeholder="Qualité" type="number" />
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
      <input 
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" 
        {...props} 
      />
    </div>
  </div>
);


const NommerInput = ({  placeholder }) => (
    <div className="space-y-1">
      <input 
        type="text"
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
        placeholder={placeholder}
      />
    </div>
);

export default AjoutRessourceForm;