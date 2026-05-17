'use client'
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdTimeline, MdErrorOutline, MdReportProblem, MdRefresh } from "react-icons/md";

const ParetoSchema = ({ workflowId }) => {
  const [realProblems, setRealProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch data from the Brainstorming step
  useEffect(() => {
    const fetchBrainstormingData = async () => {
      if (!workflowId) return;
      try {
        const res = await fetch(`/api/admin/analyses?workflowId=${workflowId}&type=BRAINSTORMING`);
        const data = await res.json();
        
        if (data && data.contenu) {
          // Parse the stringified JSON stored in the DB
          setRealProblems(JSON.parse(data.contenu));
        }
      } catch (err) {
        console.error("Error fetching Pareto data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrainstormingData();
  }, [workflowId]);

  // 2. Process data for the Chart
  const processedData = useMemo(() => {
    if (!realProblems || realProblems.length === 0) return [];
    
    // Sort by frequency descending
    const sorted = [...realProblems].sort((a, b) => Number(b.frequency) - Number(a.frequency));
    const totalFreq = sorted.reduce((sum, p) => sum + Number(p.frequency), 0);

    let runningSum = 0;
    return sorted.map((p) => {
      const freq = Number(p.frequency);
      runningSum += freq;
      return {
        ...p,
        weight: ((freq / totalFreq) * 100).toFixed(1),
        cumulative: ((runningSum / totalFreq) * 100).toFixed(1),
      };
    });
  }, [realProblems]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Génération du Schéma...</p>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
        <MdErrorOutline size={48} className="mb-4 opacity-20" />
        <p className="font-bold">Aucune donnée de brainstorming</p>
        <p className="text-xs text-center max-w-[250px] mt-2">
          Veuillez retourner à l&apos;étape précédente et enregistrer vos causes pour voir l&apos;analyse de Pareto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdTimeline className="text-blue-600" /> Schéma de Pareto
          </h2>
          <p className="text-sm text-slate-500 font-medium">Loi des 80/20 appliquée au Workflow #{workflowId}</p>
        </div>
        <div className="hidden md:block bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
           <span className="text-[10px] font-black text-blue-600 uppercase">Objectif : Cibler les 20% de causes prioritaires</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Chart Container */}
        <div className="xl:col-span-8 bg-slate-50 p-6 md:p-10 rounded-[3rem] border border-slate-200 min-h-[450px] overflow-x-auto custom-scrollbar relative">
          <div className="flex items-end justify-between gap-6 min-w-[600px] h-full pb-8">
            {processedData.map((item, index) => {
              const isVitalFew = parseFloat(item.cumulative) <= 85; // Focus area
              return (
                <div key={item.id} className="flex flex-col items-center gap-4 w-full group relative">
                  {/* Tooltip percentage */}
                  <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-20">
                    <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded shadow-lg">
                      {item.weight}%
                    </span>
                  </div>
                  
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${parseFloat(item.weight) * 3}px` }} 
                    transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
                    className={`w-full max-w-[55px] rounded-t-2xl shadow-lg transition-all duration-500 ${
                      isVitalFew 
                      ? "bg-gradient-to-t from-blue-700 to-blue-400 shadow-blue-200" 
                      : "bg-gradient-to-t from-slate-300 to-slate-200 shadow-slate-100"
                    }`}
                  />
                  
                  <div className="text-center h-14 flex items-start justify-center">
                    <p className={`text-[10px] font-black uppercase tracking-tighter leading-tight ${isVitalFew ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 80% Reference Line */}
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-slate-300 top-[150px] pointer-events-none">
             <span className="absolute right-4 -top-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Seuil 80%</span>
          </div>
        </div>

        {/* List Container */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
            <MdReportProblem className="text-blue-500" size={18}/> Hiérarchie des impacts
          </h3>
          
          <div className="space-y-3">
            {processedData.map((item) => {
              const isVital = parseFloat(item.cumulative) <= 85;
              return (
                <div key={item.id} className={`p-5 rounded-[2rem] border transition-all group ${isVital ? 'bg-white border-blue-100 shadow-md ring-1 ring-blue-50' : 'bg-slate-50/50 border-slate-100 opacity-70'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-black tracking-tight ${isVital ? 'text-slate-800' : 'text-slate-500'}`}>
                      {item.text}
                    </span>
                    <span className={`text-[11px] font-black ${isVital ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.weight}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.weight}%` }}
                      transition={{ duration: 1.5, ease: "anticipate" }}
                      className={`h-full rounded-full ${isVital ? "bg-blue-600" : "bg-slate-300"}`}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[9px] font-bold text-slate-300 uppercase">Cumulé</span>
                    <span className="text-[9px] font-black text-slate-400">{item.cumulative}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParetoSchema;