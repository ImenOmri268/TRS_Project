'use client'
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdTimeline, MdErrorOutline, MdReportProblem, MdSave } from "react-icons/md";

const ParetoSchema = ({ ressourceId, activeWorkflow, onSaveStep }) => {
  const [categoriesData, setCategoriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetching problem identification layout data matching this active workflow session
  useEffect(() => {
    const fetchIdentificationData = async () => {
      if (!activeWorkflow?.id) return;
      try {
        // FIXED: Fetch rows matching this session directly from the workflows collection
        const res = await fetch(`/api/admin/workflow?workflowId=${activeWorkflow.id}`);
        if (res.ok) {
          const data = await res.json();
          
          // Look for the BRAINSTORMING data row entry generated at step 1
          const brainstormingBlock = Array.isArray(data)
            ? data.find(analysis => analysis.type === "BRAINSTORMING")
            : null;

          if (brainstormingBlock && brainstormingBlock.contenu) {
            setCategoriesData(JSON.parse(brainstormingBlock.contenu));
          } else {
            setCategoriesData([]);
          }
        }
      } catch (err) {
        console.error("Error fetching Pareto data source:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdentificationData();
  }, [activeWorkflow]);

  // 2. Dynamic aggregation process mapping categories and their relative count percentage
  const processedPareto = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return [];

    // Sum up cumulative problems grouped per Category Block
    const formatted = categoriesData.map(cat => {
      const problemCount = cat.problems ? cat.problems.length : 0;
      return {
        id: cat.id,
        name: cat.name,
        problemCount: problemCount
      };
    }).sort((a, b) => b.problemCount - a.problemCount); // Descending order sorting

    const totalProblemsGlobal = formatted.reduce((sum, item) => sum + item.problemCount, 0);
    if (totalProblemsGlobal === 0) return [];

    let runningSum = 0;
    return formatted.map(item => {
      runningSum += item.problemCount;
      const weightPercentage = (item.problemCount / totalProblemsGlobal) * 100;
      const cumulativePercentage = (runningSum / totalProblemsGlobal) * 100;

      return {
        ...item,
        weight: parseFloat(weightPercentage.toFixed(1)),
        cumulative: parseFloat(cumulativePercentage.toFixed(1))
      };
    });
  }, [categoriesData]);

  // 3. Save calculated Pareto criteria to database automatically or on confirmation
  const handleSaveParetoAction = async () => {
    if (!activeWorkflow?.id || !ressourceId) {
      return alert("Session de traitement ou ressource introuvable.");
    }
    
    // Filter out categories strictly under or hitting the boundary condition of the 80% Pareto limit
    const vitalFewCategories = processedPareto.filter((item, index) => {
      // If it's the first category and immediately goes over 80, we keep it to ensure an analysis stream remains active
      return item.cumulative <= 80 || index === 0 || (processedPareto[index - 1]?.cumulative < 80);
    });

    setSaving(true);
    try {
      // FIXED: Posting to our main multi-row workflows controller endpoint
      const response = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          ressourceId: parseInt(ressourceId),
          type: "PARETO", // Aligned with schema analysis type configuration values
          contenu: JSON.stringify(vitalFewCategories)
        }),
      });
      
      if (response.ok) {
        if (typeof onSaveStep === "function") {
          onSaveStep(vitalFewCategories);
        }
        alert("Analyse de Pareto enregistrée ! Les catégories prioritaires ont été transmises à l'étape suivante.");
      } else {
        const errorData = await response.json();
        alert(`Erreur de sauvegarde: ${errorData.error || "Inconnue"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde du diagramme.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Calcul de Pareto en cours...</p>
      </div>
    );
  }

  if (processedPareto.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
        <MdErrorOutline size={48} className="mb-4 opacity-20" />
        <p className="font-bold">Diagramme Indisponible</p>
        <p className="text-xs text-center max-w-[280px] mt-2">
          Veuillez d&apos;abord identifier les catégories et problèmes de cette ressource à l&apos;étape précédente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdTimeline className="text-blue-600" /> Diagramme de Pareto (80/20)
          </h2>
          <p className="text-sm text-slate-500 font-medium tracking-tight">
            Priorisation des catégories de pannes par volume d&apos;impact.
          </p>
        </div>
        <button
          onClick={handleSaveParetoAction}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <MdSave size={18} /> {saving ? "Enregistrement..." : "Valider et Envoyer"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Visual Dynamic Bar Columns */}
        <div className="xl:col-span-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[420px] overflow-x-auto relative">
          <div className="flex items-end justify-between gap-8 min-w-[550px] h-full pb-8 pt-12">
            {processedPareto.map((item, index) => {
              // Vital few condition mapping directly below or hitting exactly 80
              const isCriticalZone = item.cumulative <= 80 || index === 0 || (processedPareto[index - 1]?.cumulative < 80);

              return (
                <div key={item.id} className="flex flex-col items-center gap-4 w-full group relative">
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-20">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap">
                      {item.problemCount} Problèmes ({item.weight}%)
                    </span>
                  </div>
                  
                  {/* Graphical Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(item.weight * 3.2, 14)}px` }} 
                    transition={{ duration: 1, ease: "backOut", delay: index * 0.1 }}
                    className={`w-full max-w-[50px] rounded-t-xl transition-all duration-500 ${
                      isCriticalZone 
                        ? "bg-gradient-to-t from-blue-600 to-cyan-400 shadow-lg shadow-blue-100" 
                        : "bg-slate-200"
                    }`}
                  />
                  
                  {/* Category Name Tag Label */}
                  <div className="text-center h-10 flex items-start justify-center">
                    <p className={`text-[10px] font-bold uppercase tracking-tight leading-tight max-w-[90px] ${
                      isCriticalZone ? 'text-blue-700 font-extrabold' : 'text-slate-400 font-medium'
                    }`}>
                      {item.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>

        {/* Legend Panel and Sequence Checklist List */}
        <div className="xl:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4 ml-2">
            <MdReportProblem className="text-blue-500" size={16}/> Répartition des Catégories
          </h3>
          
          <div className="space-y-3">
            {processedPareto.map((item, index) => {
              const isCritical = item.cumulative <= 80 || index === 0 || (processedPareto[index - 1]?.cumulative < 80);
              return (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isCritical 
                      ? 'bg-white border-blue-100 shadow-sm' 
                      : 'bg-slate-50/70 border-transparent opacity-50 grayscale'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase truncate max-w-[180px]">
                      {item.name}
                    </span>
                    <span className={`text-xs font-black ${isCritical ? 'text-blue-600' : 'text-slate-500'}`}>
                      {item.cumulative}% Cumulative
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.weight}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full ${isCritical ? "bg-gradient-to-r from-blue-500 to-cyan-400" : "bg-slate-300"}`}
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