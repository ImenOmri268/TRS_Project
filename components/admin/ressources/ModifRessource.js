'use client'
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";
import { MdClose, MdSettings, MdAnalytics, MdCheckCircle, MdMemory, MdToggleOn } from "react-icons/md";

const ModifRessource = ({ openmodif, setopenmodif }) => {
  return (
    <AnimatePresence mode="wait">
      {openmodif && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setopenmodif(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />

          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
                <h2 className="text-xl font-bold">Modifier la Ressource</h2>
                <button onClick={() => setopenmodif(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Configuration Générale</h3>
                  <div className="grid gap-4">
                    <ModalInput icon={MdMemory} label="Nom de la Ressource" placeholder="Ex: Machine CNC 01" />
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-[#3B82F6] transition-all">
                    <MdToggleOn className="text-2xl text-slate-400" />
                    <div className="flex-1 text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status de esm ressource</label>
                        <select className="w-full bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer ">
                          <option  value="actif">Actif</option>
                          <option value="inactif">Inactif</option>
                        </select>
                    </div>
                                      
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Paramètres de Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModalInput icon={MdSettings} label="Taux de Disponibilité (%)" placeholder="95" type="number" />
                    <ModalInput icon={MdAnalytics} label="Taux de Performance (%)" placeholder="80" type="number" />
                    <ModalInput icon={MdCheckCircle} label="Taux de Qualité (%)" placeholder="99" type="number" />
                  </div>
                </div>

                
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button onClick={() => setopenmodif(false)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  Enregistrer
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
      <input className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" {...props} />
    </div>
  </div>
);

export default ModifRessource;