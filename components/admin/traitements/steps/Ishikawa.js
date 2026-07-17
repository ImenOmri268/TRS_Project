'use client'
import React, { useState, useEffect } from "react";
import { MdOutlineSettingsInputComponent, MdSave, MdErrorOutline } from "react-icons/md";

const Ishikawa = ({ ressourceId, activeWorkflow, onSaveStep }) => {
  const [fishHeads, setFishHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fishData, setFishData] = useState({});

  const categories = [
    { name: "Méthode", id: "methode", pos: "top", offset: "0%" },
    { name: "Environnement", id: "milieu", pos: "top", offset: "33%" },
    { name: "Matériel", id: "materiel", pos: "top", offset: "66%" },
    { name: "Matière", id: "matiere", pos: "bottom", offset: "15%" },
    { name: "Main d'œuvre", id: "main_doeuvre", pos: "bottom", offset: "50%" },
  ];

  useEffect(() => {
    const initializeIshikawa = async () => {
      if (!activeWorkflow?.id) return;

      try {
        const res = await fetch(`/api/admin/workflow?workflowId=${activeWorkflow.id}`);
        
        if (res.ok) {
          const workflowsData = await res.json();
          
          const whyRow = Array.isArray(workflowsData) 
            ? workflowsData.find(analysis => analysis.type === "CINQ_POURQUOI") 
            : null;
            
          const paretoRow = Array.isArray(workflowsData) 
            ? workflowsData.find(analysis => analysis.type === "PARETO") 
            : null;

          let loadedHeads = [];
          let initialFish = {};

          if (whyRow && whyRow.contenu) {
            const parsedWhys = JSON.parse(whyRow.contenu);
            const paretoCategories = paretoRow && paretoRow.contenu ? JSON.parse(paretoRow.contenu) : [];

            Object.keys(parsedWhys).forEach((catId) => {
              const whyArray = parsedWhys[catId];
              const fifthStep = whyArray?.[4]; // Get the 5th step object
              
              // FIXED: Extract the actual string text from the structured object format safely
              let finalRootCauseText = "";
              if (fifthStep) {
                finalRootCauseText = typeof fifthStep === "string" 
                  ? fifthStep 
                  : fifthStep.answer || fifthStep.why || "";
              }

              const parentCategory = paretoCategories.find(c => c.id.toString() === catId.toString());

              if (finalRootCauseText && finalRootCauseText.trim() !== "") {
                loadedHeads.push({
                  id: catId,
                  text: finalRootCauseText.trim(),
                  categoryContext: parentCategory ? parentCategory.name : "Axe Critique"
                });

                initialFish[catId] = {
                  methode: ["", ""],
                  milieu: ["", ""],
                  materiel: ["", ""],
                  matiere: ["", ""],
                  main_doeuvre: ["", ""],
                };
              }
            });
            setFishHeads(loadedHeads);
          }

          const ishRow = Array.isArray(workflowsData) 
            ? workflowsData.find(analysis => analysis.type === "ISHIKAWA") 
            : null;

          if (ishRow && ishRow.contenu) {
            const parsedIshData = JSON.parse(ishRow.contenu);
            Object.keys(parsedIshData).forEach(catId => {
              if (initialFish[catId]) {
                initialFish[catId] = parsedIshData[catId];
              }
            });
          }
          
          setFishData(initialFish);
        }
      } catch (err) {
        console.error("Ishikawa workspace generation crash recovery:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initializeIshikawa();
  }, [activeWorkflow]);

  const handleInputChange = (headId, catId, index, value) => {
    setFishData(prev => ({
      ...prev,
      [headId]: {
        ...prev[headId],
        [catId]: (prev[headId]?.[catId] || ["", ""]).map((v, i) => (i === index ? value : v))
      }
    }));
  };

  const saveAllIshikawaDiagrams = async () => {
    if (!activeWorkflow?.id || !ressourceId) {
      return alert("Session de traitement ou ressource introuvable.");
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          ressourceId: parseInt(ressourceId),
          type: "ISHIKAWA", 
          contenu: JSON.stringify(fishData)
        })
      });
      
      if (res.ok) {
        if (typeof onSaveStep === "function") {
          onSaveStep(fishData);
        }
        alert("Tous les diagrammes d'Ishikawa ont été enregistrés avec succès !");
      } else {
        const errorData = await res.json();
        alert(`Erreur de sauvegarde: ${errorData.error || "Inconnue"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde globale des diagrammes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Construction de l&apos;arbre d&apos;Ishikawa...</p>
    </div>
  );

  if (fishHeads.length === 0) return (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
      <MdErrorOutline size={48} className="mb-4 opacity-20" />
      <p className="font-bold">Diagramme indisponible</p>
      <p className="text-xs text-center max-w-[300px] mt-2">
        Veuillez renseigner et sauvegarder la 
        <span className="font-bold text-blue-500"> Cause Majeure (Ligne 5)</span> dans l&apos;onglet des 5 Pourquoi d&apos;abord.
      </p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <MdOutlineSettingsInputComponent className="text-blue-600" size={32} />
            Diagrammes d&apos;Ishikawa (5M)
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Déployez les facteurs influents pour chaque cause majeure identifiée.
          </p>
        </div>
        <button 
          onClick={saveAllIshikawaDiagrams}
          disabled={saving}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-100"
        >
          <MdSave size={18} /> {saving ? "Enregistrement..." : "Enregistrer les Arbres"}
        </button>
      </div>

      {fishHeads.map((head) => (
        <div key={head.id} className="bg-slate-50/40 p-10 rounded-[2.5rem] border border-slate-200/60 relative">
          
          <div className="inline-block bg-blue-50 text-blue-600 font-extrabold text-[10px] uppercase tracking-widest border border-blue-100 px-3 py-1 rounded-md mb-2">
            Axe : {head.categoryContext}
          </div>

          <div className="min-w-[1000px] h-[520px] relative mt-4 overflow-x-auto">
            
            {/* CENTRAL SPINE */}
            <div className="absolute top-1/2 left-0 w-[89%] h-1.5 bg-slate-200 -translate-y-1/2 rounded-full" />

            {/* THE PROBLEM HEAD */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className="relative bg-slate-900 text-white px-8 py-6 max-w-[240px] text-center font-black rounded-2xl shadow-xl z-10 uppercase tracking-tight text-sm ring-[10px] ring-white">
                {head.text}
              </div>
            </div>

            {/* BONES & CATEGORIES DEPLOYMENT */}
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="absolute w-[260px]"
                style={{ left: cat.offset, top: cat.pos === 'top' ? '0%' : '52%', height: '45%' }}
              >
                <div className="flex flex-col items-center h-full relative">
                  
                  <div className={`px-5 py-2 rounded-xl text-[9px] font-black shadow-sm z-20 w-fit text-center uppercase tracking-widest border transition-all
                    ${cat.pos === 'top' 
                      ? 'bg-blue-600 border-blue-600 text-white mb-auto shadow-blue-50' 
                      : 'bg-blue-600 border-blue-600 text-white mt-auto order-last shadow-sm'}`}>
                    {cat.name}
                  </div>

                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1="50%" y1={cat.pos === 'top' ? "5%" : "75%"} 
                      x2="95%" y2={cat.pos === 'top' ? "100%" : "5%"} 
                      stroke={"#2563eb"} 
                      strokeWidth="2.5" strokeDasharray="5 4"
                    />
                  </svg>

                  <div className={`absolute w-full px-2 space-y-6 ${cat.pos === 'top' ? 'top-14' : 'bottom-14'}`}>
                    {[0, 1].map(idx => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-1 top-1/2 w-3 h-0.5 bg-slate-200 group-focus-within:bg-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          value={fishData[head.id]?.[cat.id]?.[idx] || ""}
                          onChange={(e) => handleInputChange(head.id, cat.id, idx, e.target.value)}
                          placeholder="Ajouter un facteur..." 
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ishikawa;