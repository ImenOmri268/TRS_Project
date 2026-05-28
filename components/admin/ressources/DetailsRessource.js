'use client'
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdClose, MdLayers, MdHistory, MdInfoOutline } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const DetailsRessource = ({ resourceData, setSelectedDetails }) => {
  const isOpen = !!resourceData;

  // --- LOGIC TO GROUP METRICS BY DATE ---
  const getGroupedHistory = () => {
    if (!resourceData?.metrics) return [];

    // Group metrics by date string (YYYY-MM-DD)
    const groups = resourceData.metrics.reduce((acc, metric) => {
      const dateKey = new Date(metric.date).toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, disponibilite: "-", performance: "-", qualite: "-", trs: 0 };
      }
      
      // Assign the value based on category
      if (metric.category === 'DISPONIBILITE') acc[dateKey].disponibilite = `${metric.valeur}%`;
      if (metric.category === 'PERFORMANCE') acc[dateKey].performance = `${metric.valeur}%`;
      if (metric.category === 'QUALITE') acc[dateKey].qualite = `${metric.valeur}%`;
      
      return acc;
    }, {});

    // Convert back to array and calculate an estimated TRS (Disp * Perf * Qual)
    return Object.values(groups).map(row => {
      const d = parseFloat(row.disponibilite) || 0;
      const p = parseFloat(row.performance) || 0;
      const q = parseFloat(row.qualite) || 0;
      // Simple TRS calculation for display
      const calculatedTrs = ((d/100) * (p/100) * (q/100)) * 100;
      return { ...row, trs: calculatedTrs > 0 ? `${calculatedTrs.toFixed(2)}%` : "-" };
    });
  };

  const history = getGroupedHistory();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedDetails(null)}  
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                    <MdLayers size={24}/>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-900 leading-none">{resourceData.nom}</h2>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                            resourceData.statut ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                        }`}>
                            {resourceData.statut ? "Actif" : "Inactif"}
                        </span>
                    </div>
                    <span className="mt-1 inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">
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
                
                {/* 1. Description Section */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                    <MdInfoOutline className="absolute -right-2 -top-2 text-slate-200 text-6xl rotate-12" />
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-3">
                        Description Technique
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                      {resourceData.description || "Aucune description détaillée n'est disponible."}
                    </p>
                  </div>
                </div>

                {/* 2. History Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MdHistory className="text-blue-500 text-xl" /> Historique des Performances
                  </h3>
                  
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Dispo.</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Perf.</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Qualité</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">TRS </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {history.length > 0 ? (
                          history.map((row, index) => (
                            <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-bold text-slate-500">
                                    {row.date}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">
                                {row.disponibilite}
                              </td>
                              <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">
                                {row.performance}
                              </td>
                              <td className="px-6 py-4 text-sm text-center font-medium text-slate-600">
                                {row.qualite}
                              </td>
                              <td className="px-6 py-4 text-sm font-black text-blue-600 text-right">
                                {row.trs}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm italic">
                              Aucune donnée de performance enregistrée.
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
                <button onClick={() => setSelectedDetails(null)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DetailsRessource;