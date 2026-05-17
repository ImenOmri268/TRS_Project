'use client'
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdTimeline, MdErrorOutline, MdReportProblem } from "react-icons/md";

const ParetoSchema = ({ workflowId }) => {
  const [realProblems, setRealProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrainstormingData = async () => {
      // Ensure we have a valid numeric ID
      const numericId = parseInt(workflowId);
      if (!numericId) return;

      try {
        // Fetching specifically the BRAINSTORMING type for this workflow
        const res = await fetch(`/api/admin/analyses?workflowId=${numericId}&type=BRAINSTORMING`);
        const data = await res.json();
        
        // IMPORTANT: data is an array from findMany. We take the first result.
        if (data && data.length > 0 && data[0].contenu) {
          setRealProblems(JSON.parse(data[0].contenu));
        } else {
          setRealProblems([]);
        }
      } catch (err) {
        console.error("Error fetching Pareto data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrainstormingData();
  }, [workflowId]);

  const processedData = useMemo(() => {
    if (!realProblems || realProblems.length === 0) return [];
    
    // Convert frequencies to numbers and sort descending
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
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Calcul des priorités...</p>
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
        <MdErrorOutline size={48} className="mb-4 opacity-20" />
        <p className="font-bold">Analyse indisponible</p>
        <p className="text-xs text-center max-w-[250px] mt-2">
          Veuillez d&apos;abord enregistrer des données dans l&apos;onglet 
          <span className="font-bold text-blue-500"> Brainstorming</span>.
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
          <p className="text-sm text-slate-500 font-medium tracking-tight">Analyse des causes critiques pour le Workflow #{workflowId}</p>
        </div>
        <div className="hidden md:block bg-blue-50 px-5 py-2.5 rounded-2xl border border-blue-100">
           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Règle des 80/20</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Visual Chart */}
        <div className="xl:col-span-8 bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 min-h-[450px] overflow-x-auto relative">
          <div className="flex items-end justify-between gap-6 min-w-[600px] h-full pb-8 pt-10">
            {processedData.map((item, index) => {
              const isVitalFew = parseFloat(item.cumulative) <= 85; 
              return (
                <div key={item.id} className="flex flex-col items-center gap-4 w-full group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-20">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-xl">
                      {item.weight}%
                    </span>
                  </div>
                  
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(parseFloat(item.weight) * 3, 10)}px` }} 
                    transition={{ duration: 1, ease: "backOut", delay: index * 0.1 }}
                    className={`w-full max-w-[45px] rounded-t-xl transition-all duration-500 ${
                      isVitalFew 
                      ? "bg-gradient-to-t from-blue-700 to-cyan-400 shadow-lg shadow-blue-200" 
                      : "bg-slate-200"
                    }`}
                  />
                  
                  <div className="text-center h-12 flex items-start justify-center">
                    <p className={`text-[9px] font-black uppercase tracking-tighter leading-tight max-w-[80px] ${isVitalFew ? 'text-blue-700' : 'text-slate-400'}`}>
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-red-200 top-[180px] pointer-events-none opacity-50">
             <span className="absolute right-6 -top-6 text-[9px] font-black text-red-400 uppercase tracking-[0.2em]">Zone Critique (80%)</span>
          </div>
        </div>

        {/* Legend / Hierarchy */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6 ml-2">
            <MdReportProblem className="text-blue-500" size={16}/> Priorités d&apos;action
          </h3>
          
          <div className="space-y-3">
            {processedData.map((item) => {
              const isVital = parseFloat(item.cumulative) <= 85;
              return (
                <div key={item.id} className={`p-5 rounded-3xl border transition-all ${isVital ? 'bg-white border-blue-100 shadow-sm' : 'bg-slate-50/50 border-transparent opacity-60 grayscale'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight truncate mr-2">
                      {item.text}
                    </span>
                    <span className={`text-xs font-black ${isVital ? 'text-blue-600' : 'text-slate-500'}`}>
                      {item.weight}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.weight}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${isVital ? "bg-blue-500" : "bg-slate-300"}`}
                    />
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