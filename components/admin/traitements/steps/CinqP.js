'use client'
import React, { useState, useEffect } from "react";
import { MdHelpOutline, MdOutlinePsychology, MdSave, MdErrorOutline } from "react-icons/md";

const CinqP = ({ ressourceId, activeWorkflow, onSaveStep }) => {
  const [criticalCategories, setCriticalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const initializeData = async () => {
      if (!activeWorkflow?.id) return;

      try {
        // FIXED: Fetching all relevant analysis rows mapped to this single active workflow sequence
        const res = await fetch(`/api/admin/workflow?workflowId=${activeWorkflow.id}`);
        if (res.ok) {
          const workflowsData = await res.json();
          
          // 1. Identify the Pareto record entry row to render the critical workspace cards
          const paretoRow = Array.isArray(workflowsData)
            ? workflowsData.find(analysis => analysis.type === "PARETO")
            : null;

          let loadedCategories = [];
          if (paretoRow && paretoRow.contenu) {
            loadedCategories = JSON.parse(paretoRow.contenu);
            setCriticalCategories(loadedCategories);
          }

          // 2. Extract existing 5-Whys row data if previously saved during this session path
          const whyRow = Array.isArray(workflowsData)
            ? workflowsData.find(analysis => analysis.type === "CINQ_POURQUOI")
            : null;

          const initialResponses = {};
          // Prefill empty rows structure for each active Pareto category block
          loadedCategories.forEach(cat => {
            initialResponses[cat.id] = ["", "", "", "", ""];
          });

          // Overlay with matching records pulled out from Database
          if (whyRow && whyRow.contenu) {
            const parsedData = JSON.parse(whyRow.contenu);
            Object.keys(parsedData).forEach(catId => {
              if (initialResponses[catId]) {
                initialResponses[catId] = parsedData[catId];
              }
            });
          }
          
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Error initializing 5 Whys workflow context:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [activeWorkflow]);

  const handleInputChange = (catId, index, value) => {
    setResponses(prev => ({
      ...prev,
      [catId]: prev[catId].map((val, i) => (i === index ? value : val))
    }));
  };

  const handleSaveAllWhys = async () => {
    if (!activeWorkflow?.id || !ressourceId) {
      return alert("Session de traitement ou ressource introuvable.");
    }

    setSaving(true);
    try {
      // FIXED: Posting straight to centralized workflow rows controller route
      const response = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          ressourceId: parseInt(ressourceId),
          type: "CINQ_POURQUOI", // Linked directly to database structural Enum attributes
          contenu: JSON.stringify(responses)
        })
      });
      
      if (response.ok) {
        if (typeof onSaveStep === "function") {
          onSaveStep(responses);
        }
        alert("Toutes les analyses des 5 Pourquoi ont été enregistrées ! Les causes majeures sont prêtes pour l'arbre d'Ishikawa.");
      } else {
        const errorData = await response.json();
        alert(`Erreur de sauvegarde: ${errorData.error || "Inconnue"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du traitement de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-bold text-slate-400 text-xs uppercase tracking-wider">Chargement des axes critiques...</p>
    </div>
  );

  if (criticalCategories.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
      <MdErrorOutline size={48} className="mb-4 opacity-20" />
      <p className="font-bold">Analyse indisponible</p>
      <p className="text-xs text-center max-w-[280px] mt-2">
        Veuillez d&apos;abord valider et sauvegarder le 
        <span className="font-bold text-blue-500"> Diagramme de Pareto</span> à l&apos;étape précédente.
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdOutlinePsychology className="text-blue-600" size={32} /> Analyse des 5 Pourquoi
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Déterminez la cause majeure pour chaque catégorie critique issue du Pareto.
          </p>
        </div>
        
        <button 
          onClick={handleSaveAllWhys}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <MdSave size={18} /> {saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
      </div>

      {/* Grid container responsive adjustment rendering per dynamic items */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {criticalCategories.map((cat, idx) => (
          <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative flex flex-col justify-between">
            <div>
              <div className="mb-6 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Catégorie Critique #0{idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg mt-1 uppercase tracking-tight">
                     {cat.name}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500 shrink-0">
                  <MdHelpOutline size={22} />
                </div>
              </div>

              {/* 5 Sequential Inputs Form Loop */}
              <div className="space-y-5">
                {responses[cat.id]?.map((text, i) => {
                  const isMainCause = i === 4;
                  return (
                    <div key={i} className="relative pl-9">
                      {i < 4 && <div className="absolute left-[11px] top-8 w-0.5 h-8 bg-slate-100" />}
                      
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all absolute left-0 ${
                            isMainCause 
                              ? "bg-red-500 border-red-500 text-white shadow-md shadow-red-100" 
                              : "bg-white border-slate-200 text-slate-400"
                          }`}>
                            {i + 1}
                          </div>
                          <label className={`text-[10px] font-black uppercase tracking-wider ${
                            isMainCause ? "text-red-500" : "text-slate-400"
                          }`}>
                            {isMainCause ? "Cause Majeure Finale (Transmise à Ishikawa)" : `Pourquoi n°${i + 1} ?`}
                          </label>
                        </div>
                        
                        <input 
                          type="text"
                          value={text || ""}
                          onChange={(e) => handleInputChange(cat.id, i, e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                            isMainCause 
                              ? "bg-red-50/40 border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/5 text-red-700 font-bold placeholder-red-300" 
                              : "bg-slate-50/50 border-slate-200 focus:border-blue-400 text-slate-600"
                          }`}
                          placeholder={isMainCause ? "Cause principale définitive..." : `Explicitez la cause du niveau ${i + 1}...`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinqP;