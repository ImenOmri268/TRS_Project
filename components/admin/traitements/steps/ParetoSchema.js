'use client'
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MdTimeline, MdErrorOutline, MdReportProblem } from "react-icons/md";

const fakeProblems = [
  { id: 1, text: "Coupure de courant", frequency: 99 },
  { id: 2, text: "Erreur Capteur B2", frequency: 90 },
  { id: 3, text: "Manque de matière", frequency: 100 },
  { id: 4, text: "Surchauffe moteur", frequency: 11 },
  { id: 5, text: "Maintenance préventive", frequency: 8 },
];

const ParetoSchema = () => {
  const processedData = useMemo(() => {
    if (!fakeProblems || fakeProblems.length === 0) return [];
    const sorted = [...fakeProblems].sort((a, b) => b.frequency - a.frequency);
    const totalFreq = sorted.reduce((sum, p) => sum + p.frequency, 0);

    let runningSum = 0;
    return sorted.map((p) => {
      runningSum += p.frequency;
      return {
        ...p,
        weight: ((p.frequency / totalFreq) * 100).toFixed(1),
        cumulative: ((runningSum / totalFreq) * 100).toFixed(1),
      };
    });
  }, []);

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
        <MdErrorOutline size={48} className="mb-4 opacity-20" />
        <p className="font-bold">Aucune donnée disponible</p>
        <p className="text-xs">Veuillez compléter l&apos;étape de brainstorming pour générer le schéma.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MdTimeline className="text-blue-600" /> Schéma de Pareto (80/20)
        </h2>
        <p className="text-sm text-slate-500">Visualisation basée sur le poids relatif (%) de chaque problème.</p>
      </div>

      {/* Changed lg:grid-cols-12 to xl:grid-cols-12 for better mid-size handling */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Chart Container: Added overflow-x-auto and custom scrollbar styling */}
        <div className="xl:col-span-8 bg-slate-200 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 min-h-full overflow-x-auto custom-scrollbar">
          <div className="flex items-end justify-between gap-4 min-w-[600px] h-full pb-4">
            {processedData.map((item, index) => (
              <div key={item.id} className="flex flex-col items-center gap-4 w-full group relative">
                {/* Percentage Label */}
                <span className="text-[10px] font-black text-blue-600 bg-white px-2 py-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.weight}%
                </span>
                
               <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${parseFloat(item.weight) * 2.8}px` }} 
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.33, 1, 0.68, 1],
                    delay: index * 0.08 
                  }}
                  // New Condition: index < 2 colors the first two bars blue
                  className={`w-full max-w-[50px] rounded-t-2xl shadow-xl transition-colors duration-500 ${
                    index < 2 
                    ? "bg-gradient-to-t from-blue-600 to-blue-400 shadow-blue-100" 
                    : "bg-gradient-to-t from-slate-400 to-slate-300 shadow-slate-50"
                  }`}
                />
                
                <div className="text-center h-12 flex items-start justify-center">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight break-words max-w-[80px]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List Container */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MdReportProblem className="text-blue-500" size={18}/> Analyse des fréquences
          </h3>
          
          <div className="space-y-3">
            {processedData.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.text}
                  </span>
                  <span className="text-[10px] font-black text-slate-400">
                    {item.weight}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.weight}%` }}
                    transition={{ duration: 1.5 }}
                    className={`h-full rounded-full ${Number(item.cumulative) <= 80 ? "bg-blue-500" : "bg-slate-300"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParetoSchema;