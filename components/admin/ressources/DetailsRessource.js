'use client'
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdClose, MdLayers, MdHistory, MdInfoOutline } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const DetailsRessource = ({ resourceData, setSelectedDetails }) => {
  const isOpen = !!resourceData;

  // Helper to calculate Global TRS percentage
  const calculateGlobalTRS = (d, p, q) => {
    const total = (d / 100) * (p / 100) * (q / 100) * 100;
    return total.toFixed(1) + "%";
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedDetails(false)}  
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
                  >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col">
              
              {/* Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                    <MdLayers size={24}/>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-none mb-1">{resourceData.nom}</h2>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">
                      {resourceData.type}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedDetails(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                
                {/* 1. Description & Info Section */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                    <MdInfoOutline className="absolute -right-2 -top-2 text-slate-200 text-6xl rotate-12" />
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-3">
                       Informations Générales
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                      {resourceData.description || "Aucune description détaillée n'est disponible pour cette ressource technique."}
                    </p>
                  </div>
                </div>

                {/* 2. TRS History Table */}
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
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Date d&apos;enregistrement</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Disponibilité</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Performance</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-center">Qualité</th>
                          <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase text-right">TRS Global</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {resourceData.trs && resourceData.trs.length > 0 ? (
                          resourceData.trs.map((record, idx) => (
                            <tr key={record.id || idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                                {new Date(record.createdAt).toLocaleDateString('fr-FR')}
                              </td>
                              <td className="px-6 py-4 text-sm text-center text-slate-500">{record.disponibilite}%</td>
                              <td className="px-6 py-4 text-sm text-center text-slate-500">{record.performance}%</td>
                              <td className="px-6 py-4 text-sm text-center text-slate-500">{record.qualite}%</td>
                              <td className="px-6 py-4 text-sm font-bold text-blue-600 text-right">
                                {calculateGlobalTRS(record.disponibilite, record.performance, record.qualite)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm italic">
                              Aucun historique de performance enregistré.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button 
                  onClick={() => setSelectedDetails(null)} 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <IoReturnUpBack /> Fermer
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                   Exporter les données
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