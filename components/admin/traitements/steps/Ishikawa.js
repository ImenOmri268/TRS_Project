'use client'
import React, { useState, useEffect } from "react";
import { MdOutlineSettingsInputComponent, MdSave } from "react-icons/md";

const Ishikawa = ({ workflowId }) => {
  const [topCauses, setTopCauses] = useState([]);
  const [loading, setLoading] = useState(true);
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
      const numericId = parseInt(workflowId);
      if (!numericId) return;

      try {
        // 1. Fetch Brainstorming to get the effect/head of the fish
        const brainRes = await fetch(`/api/admin/analyses?workflowId=${numericId}&type=BRAINSTORMING`);
        const brainData = await brainRes.json();
        
        let sorted = [];
        if (brainData && brainData.length > 0 && brainData[0].contenu) {
          sorted = JSON.parse(brainData[0].contenu)
            .sort((a, b) => Number(b.frequency) - Number(a.frequency))
            .slice(0, 2);
          setTopCauses(sorted);
        }

        // 2. Fetch existing Ishikawa diagrams
        const ishRes = await fetch(`/api/admin/analyses?workflowId=${numericId}&type=ISHIKAWA`);
        const ishDataResponse = await ishRes.json();

        const initialFish = {};
        // Default empty structure
        sorted.forEach(cause => {
          initialFish[cause.id] = {
            methode: ["", ""],
            milieu: ["", ""],
            materiel: ["", ""],
            matiere: ["", ""],
            main_doeuvre: ["", ""],
          };
        });

        // Populate with saved data if it exists
        if (ishDataResponse && ishDataResponse.length > 0) {
          ishDataResponse.forEach(analysis => {
            const parsed = JSON.parse(analysis.contenu);
            // We match by the text/title of the problem since IDs in brainstorming are local
            const match = sorted.find(s => s.text === parsed.problemTitle);
            if (match) {
              initialFish[match.id] = parsed.details;
            }
          });
        }
        
        setFishData(initialFish);
      } catch (err) {
        console.error("Ishikawa initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeIshikawa();
  }, [workflowId]);

  const handleInputChange = (causeId, catId, index, value) => {
    setFishData(prev => ({
      ...prev,
      [causeId]: {
        ...prev[causeId],
        [catId]: prev[causeId][catId].map((v, i) => (i === index ? value : v))
      }
    }));
  };

  const saveIshikawa = async (causeId, title) => {
    const numericId = parseInt(workflowId);
    try {
      const res = await fetch("/api/admin/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: numericId,
          type: "ISHIKAWA",
          contenu: JSON.stringify({
            problemTitle: title,
            details: fishData[causeId]
          })
        })
      });
      if (res.ok) {
        alert(`Diagramme pour "${title}" enregistré avec succès !`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Initialisation du diagramme...</p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="px-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <MdOutlineSettingsInputComponent className="text-blue-600" size={32} />
          Diagramme d&apos;Ishikawa
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium italic">
          Analyse des causes racines par catégorie (5M) pour le Workflow #{workflowId}.
        </p>
      </div>

      {topCauses.map((cause) => (
        <div key={cause.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-x-auto custom-scrollbar">
          
          <div className="min-w-[1000px] h-[500px] relative mt-10">
            
            {/* CENTRAL SPINE */}
            <div className="absolute top-1/2 left-0 w-[80%] h-1.5 bg-slate-200 -translate-y-1/2 rounded-full" />

            {/* THE PROBLEM HEAD (Effect) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className="relative bg-slate-900 text-white px-10 py-8 min-w-[300px] text-center font-black rounded-2xl shadow-2xl z-10 uppercase tracking-tighter text-lg ring-[12px] ring-slate-50">
                {cause.text}
                <div className="absolute top-1/2 -right-10 w-10 h-10 bg-slate-900 rotate-45 -translate-y-1/2 -z-10" />
              </div>
            </div>

            {/* BONES & CATEGORIES */}
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="absolute w-[280px]"
                style={{ left: cat.offset, top: cat.pos === 'top' ? '0%' : '50%', height: '45%' }}
              >
                <div className="flex flex-col items-center h-full relative">
                  
                  {/* Category Label */}
                  <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black shadow-sm z-20 w-fit text-center uppercase tracking-[0.2em] border-2 transition-all
                    ${cat.pos === 'top' 
                      ? 'bg-blue-600 border-blue-600 text-white mb-auto shadow-blue-100' 
                      : 'bg-white border-slate-200 text-slate-500 mt-auto order-last shadow-slate-100'}`}>
                    {cat.name}
                  </div>

                  {/* Bone Graphic */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1="50%" y1={cat.pos === 'top' ? "25%" : "75%"} 
                      x2="100%" y2={cat.pos === 'top' ? "100%" : "0%"} 
                      stroke={cat.pos === 'top' ? "#3b82f6" : "#e2e8f0"} 
                      strokeWidth="3" strokeDasharray="6 4"
                    />
                  </svg>

                  {/* Specific Cause Inputs */}
                  <div className={`absolute w-full px-4 space-y-8 ${cat.pos === 'top' ? 'top-16' : 'bottom-16'}`}>
                    {[0, 1].map(idx => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-2 top-1/2 w-4 h-0.5 bg-blue-100 group-focus-within:bg-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          value={fishData[cause.id]?.[cat.id]?.[idx] || ""}
                          onChange={(e) => handleInputChange(cause.id, cat.id, idx, e.target.value)}
                          placeholder="Facteur influent..." 
                          className="w-full bg-transparent border-b-2 border-slate-100 px-2 py-2 text-[11px] focus:border-blue-500 focus:bg-slate-50/50 outline-none transition-all font-bold placeholder:text-slate-300 placeholder:font-normal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAVE ACTION */}
          <div className="mt-12 flex justify-between items-center border-t border-slate-50 pt-8">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Analyse des 5M (Milieu, Méthode, Matériel, Matière, Main d&apos;œuvre)
                </p>
            </div>
            <button 
              onClick={() => saveIshikawa(cause.id, cause.text)}
              className="flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              ENREGISTRER LE DIAGRAMME <MdSave size={20} />
            </button>
          </div>
        </div>
      ))}

      {topCauses.length === 0 && (
        <div className="p-32 bg-slate-50 rounded-[4rem] text-center border-4 border-dashed border-slate-100">
           <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-sm">Données manquantes</p>
        </div>
      )}
    </div>
  );
};

export default Ishikawa;