'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSettings, MdToggleOn, MdEditAttributes } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const ModifRessource = ({ resourceData, setSelectedResource }) => {
  const isOpen = !!resourceData;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
           <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      onClick={setSelectedResource} 
                      className="fixed inset-0  bg-slate-900/40 backdrop-blur-sm z-[70] h-full" />
          
                      
                    <motion.div 
                      initial={{ x: "100%" }} 
                      animate={{ x: 0 }} 
                      exit={{ x: "100%" }} 
                      className="fixed  right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col">
            <div className="bg-white  shadow-2xl w-full max-w-lg max-h-lg overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MdSettings size={24} /></div>
                  <h2 className="text-xl font-bold text-slate-900">Modifier Ressource</h2>
                </div>
                <button onClick={setSelectedResource} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose size={24} className="text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Nom de la Ressource</label>
                  <input
                    defaultValue={resourceData.name}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Collection</label>
                  <input
                    placeholder={resourceData.collection}
                    className="w-full placeholder:text-black bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3">
                  <MdToggleOn className="text-2xl text-slate-400" />
                  <div className="flex-1 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Status</label>
                    <select
                      defaultValue={resourceData.status}
                      className="w-full bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-6 text-left">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MdEditAttributes className="text-amber-500 text-xl" /> rennomez les champs des seuils
                  </h3>

                  {/* Section: Disponibilité */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase ml-1">renommer les champs de disponibilité</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {resourceData.champs.disponibilité.map((field, idx) => (
                        <input
                          key={`disp-${idx}`}
                          placeholder={field}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all italic"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Section: Performance */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase ml-1">renommer les champs de performance</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {resourceData.champs.performance.map((field, idx) => (
                        <input
                          key={`perf-${idx}`}
                          placeholder={field}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all italic"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Section: Qualité */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase ml-1">renommer les champs de qualite</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {resourceData.champs.qualité.map((field, idx) => (
                        <input
                          key={`qual-${idx}`}
                          placeholder={field}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all italic"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={setSelectedResource} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  Sauvegarder
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModifRessource;