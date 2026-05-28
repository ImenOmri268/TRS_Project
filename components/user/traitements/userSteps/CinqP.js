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
        // ADAPTATION : Requête vers le nouvel endpoint unifié du pipeline
        const res = await fetch(`/api/user/workflow/pipeline?workflowId=${activeWorkflow.id}`);
        if (res.ok) {
          const workflowsData = await res.json();
          
          // ADAPTATION : Extraction directe depuis le tableau d'analyses renvoyé
          const paretoRow = Array.isArray(workflowsData)
            ? workflowsData.find(analysis => analysis.type === "PARETO")
            : null;

          let loadedCategories = [];
          if (paretoRow && paretoRow.contenu) {
            loadedCategories = JSON.parse(paretoRow.contenu);
            setCriticalCategories(loadedCategories);
          }

          const whyRow = Array.isArray(workflowsData)
            ? workflowsData.find(analysis => analysis.type === "CINQ_POURQUOI")
            : null;

          const initialResponses = {};
          // Prefill with structured array objects holding distinct why and answer states
          loadedCategories.forEach(cat => {
            initialResponses[cat.id] = [
              { why: "", answer: "" },
              { why: "", answer: "" },
              { why: "", answer: "" },
              { why: "", answer: "" },
              { why: "", answer: "" }
            ];
          });

          if (whyRow && whyRow.contenu) {
            const parsedData = JSON.parse(whyRow.contenu);
            Object.keys(parsedData).forEach(catId => {
              if (initialResponses[catId]) {
                // Ensure backward/forward compatibility during format conversion if needed
                initialResponses[catId] = parsedData[catId].map((item) => {
                  if (typeof item === 'string') {
                    return { why: "", answer: item }; // Fallback data patch
                  }
                  return item;
                });
              }
            });
          }
          
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Error initializing 5 Whys workflow context:", err);
      } finally {
        if (loading) setLoading(false);
      }
    };

    initializeData();
  }, [activeWorkflow]);

  // Targeting specific sub-property key parameters (either 'why' or 'answer')
  const handleInputChange = (catId, index, key, value) => {
    setResponses(prev => ({
      ...prev,
      [catId]: prev[catId].map((item, i) => (i === index ? { ...item, [key]: value } : item))
    }));
  };

  const handleSaveAllWhys = async () => {
    if (!activeWorkflow?.id || !ressourceId) {
      return alert("Session de traitement ou ressource introuvable.");
    }

    setSaving(true);
    try {
      // ADAPTATION : Envoi des données en POST vers l'endpoint unifié du pipeline
      const response = await fetch("/api/user/workflow/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          ressourceId: parseInt(ressourceId),
          type: "CINQ_POURQUOI", 
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER BAR ROW */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdOutlinePsychology className="text-blue-600 flex-shrink-0" size={32} /> 
            <span>Analyse des 5 Pourquoi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Déterminez la cause majeure pour chaque catégorie critique issue du Pareto.
          </p>
        </div>
        
        <button 
          onClick={handleSaveAllWhys}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
        >
          <MdSave size={18} /> {saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
      </div>

      {/* DYNAMIC PARETO BLOCKS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {criticalCategories.map((cat, idx) => (
          <div key={cat.id} className="bg-white p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm relative flex flex-col justify-between">
            <div>
              
              <div className="mb-6 flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Catégorie Critique #0{idx + 1}
                  </span>
                  <h3 className="font-bold text-slate-800 text-base sm:text-lg mt-1 uppercase tracking-tight break-words">
                     {cat.name}
                  </h3>
                </div>
                <div className="p-2.5 sm:p-3 bg-blue-50 rounded-2xl text-blue-500 shrink-0">
                  <MdHelpOutline size={22} />
                </div>
              </div>

              {/* SEQUENTIAL LOOP CONTAINER */}
              <div className="space-y-6">
                {responses[cat.id]?.map((item, i) => {
                  const isMainCause = i === 4;
                  return (
                    <div key={i} className="relative pl-7 sm:pl-9">
                      {/* Interactive connector layout line */}
                      {i < 4 && <div className="absolute left-[11px] top-8 w-0.5 h-[calc(100%+1.5rem)] bg-slate-100" />}
                      
                      <div className="flex flex-col gap-2">
                        {/* Title Badge Label Row */}
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
                            {isMainCause ? "Cause Majeure Finale (Transmise à Ishikawa)" : `Étape n°${i + 1}`}
                          </label>
                        </div>
                        
                        {/* DUAL SPLIT RESPONSIVE INPUT MATRIX LAYER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                          {/* Pourquoi Input Field */}
                          <input 
                            type="text"
                            value={item.why || ""}
                            onChange={(e) => handleInputChange(cat.id, i, "why", e.target.value)}
                            className="w-full border rounded-xl px-3 py-2 text-[11px] sm:text-xs outline-none transition-all bg-slate-50/30 border-slate-200 focus:border-blue-400 text-slate-700"
                            placeholder={`Pourquoi n°${i + 1} ?`}
                          />
                          
                          {/* Réponse Input Field */}
                          <input 
                            type="text"
                            value={item.answer || ""}
                            onChange={(e) => handleInputChange(cat.id, i, "answer", e.target.value)}
                            className={`w-full border rounded-xl px-3 py-2 text-[11px] sm:text-xs outline-none transition-all ${
                              isMainCause 
                                ? "bg-red-50/40 border-red-200 focus:border-red-400 focus:ring-4 focus:ring-red-500/5 text-red-700 font-bold placeholder-red-300" 
                                : "bg-slate-50/80 border-slate-200 focus:border-blue-400 text-slate-600"
                            }`}
                            placeholder={isMainCause ? "Cause principale définitive..." : "Réponse associée..."}
                          />
                        </div>

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