'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdLayers, MdHistory, MdInfoOutline } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const DetailsRessource = ({ resourceData, setSelectedDetails }) => {
  const isOpen = !!resourceData;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={setSelectedDetails}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y:0 }}
            exit={{ opacity: 0, y:0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col">
              
              {/* Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                    <MdLayers size={24}/>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-none mb-1">{resourceData.name}</h2>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">
                      {resourceData.collection}
                    </span>
                  </div>
                </div>
                <button onClick={setSelectedDetails} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* 1. Modern Description & Objectives Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                    <MdInfoOutline className="absolute -right-2 -top-2 text-slate-200 text-6xl rotate-12" />
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-3 flex items-center gap-2">
                       Description
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                      {resourceData.description}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-3 flex items-center gap-2">
                       Objectifs Clés
                    </h3>
                    <div className="space-y-2">
                      {resourceData.objectif.map((obj, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-slate-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          {obj}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. TRS History Table (Replacing Inputs) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <MdHistory className="text-blue-500 text-xl" /> Historique des Performances (TRS)
                    </h3>
                  </div>
                  
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Date</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Disp.</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Perf.</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Qual.</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-right">TRS Global</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {resourceData.trsHistory?.map((row, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">{row.date}</td>
                            <td className="px-6 py-4 text-sm text-center text-slate-500">{row.disp}</td>
                            <td className="px-6 py-4 text-sm text-center text-slate-500">{row.perf}</td>
                            <td className="px-6 py-4 text-sm text-center text-slate-500">{row.qual}</td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right">{row.trs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Footer (Kept the same structure as requested) */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={setSelectedDetails} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                   Recalculer les Taux
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailsRessource;