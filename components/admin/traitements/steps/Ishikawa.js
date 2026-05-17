'use client'
import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdOutlineSettingsInputComponent, MdSave } from "react-icons/md";

const Ishikawa = ({ workflowId }) => {
  const [topCauses, setTopCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State structure to hold input values for each cause and each category
  const [fishData, setFishData] = useState({});

  const categories = [
    { name: "Méthode", id: "methode", pos: "top", offset: "0%" },
    { name: "Environnement", id: "milieu", pos: "top", offset: "33%" },
    { name: "Matériel", id: "materiel", pos: "top", offset: "66%" },
    { name: "Matière", id: "matiere", pos: "bottom", offset: "15%" },
    { name: "Main d'œuvre", id: "main_doeuvre", pos: "bottom", offset: "50%" },
  ];

  useEffect(() => {
    const fetchContext = async () => {
      if (!workflowId) return;
      try {
        const res = await fetch(`/api/admin/analyses?workflowId=${workflowId}&type=BRAINSTORMING`);
        const data = await res.json();
        if (data && data.contenu) {
          const sorted = JSON.parse(data.contenu)
            .sort((a, b) => Number(b.frequency) - Number(a.frequency))
            .slice(0, 2);
          setTopCauses(sorted);

          // Initialize fishData structure
          const initialFish = {};
          sorted.forEach(cause => {
            initialFish[cause.id] = {
              methode: ["", ""],
              milieu: ["", ""],
              materiel: ["", ""],
              matiere: ["", ""],
              main_doeuvre: ["", ""],
            };
          });
          setFishData(initialFish);
        }
      } catch (err) {
        console.error("Ishikawa fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
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
    try {
      await fetch("/api/admin/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId,
          type: "ISHIKAWA",
          contenu: JSON.stringify({
            problemTitle: title,
            details: fishData[causeId]
          })
        })
      });
      alert(`Diagramme Ishikawa pour "${title}" enregistré !`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Construction des diagrammes...</div>;

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="px-4">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <MdOutlineSettingsInputComponent className="text-blue-600" size={32} />
          Diagramme d&apos;Ishikawa
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium italic">
          Répartissez les causes secondaires par catégories pour Workflow #{workflowId}.
        </p>
      </div>

      {topCauses.map((cause) => (
        <div key={cause.id} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl relative overflow-x-auto custom-scrollbar">
          
          <div className="min-w-[1000px] h-[500px] relative mt-10">
            
            {/* CENTRAL SPINE */}
            <div className="absolute top-1/2 left-0 w-[82%] h-1 bg-slate-300 -translate-y-1/2 rounded-full" />

            {/* THE PROBLEM HEAD */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className="relative bg-slate-900 text-white px-10 py-8 min-w-[280px] text-center font-black rounded-xl shadow-2xl z-10 uppercase tracking-tighter text-lg ring-8 ring-slate-100">
                {cause.text}
                <div className="absolute top-1/2 -right-10 w-10 h-10 bg-slate-900 rotate-45 -translate-y-1/2 -z-10" />
              </div>
            </div>

            {/* BONES & INPUTS */}
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="absolute w-[280px]"
                style={{ left: cat.offset, top: cat.pos === 'top' ? '0%' : '50%', height: '45%' }}
              >
                <div className="flex flex-col items-center h-full relative">
                  
                  {/* Category Label */}
                  <div className={`px-5 py-2 rounded-xl text-[10px] font-black shadow-sm z-20 w-fit text-center uppercase tracking-widest border-2 transition-all
                    ${cat.pos === 'top' ? 'bg-blue-50 border-blue-200 text-blue-600 mb-auto' : 'bg-slate-50 border-slate-200 text-slate-500 mt-auto order-last'}`}>
                    {cat.name}
                  </div>

                  {/* Bone Graphic */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <line 
                      x1="50%" y1={cat.pos === 'top' ? '20%' : '80%'} 
                      x2="100%" y2={cat.pos === 'top' ? '100%' : '0%'} 
                      stroke={cat.pos === 'top' ? "#2563eb" : "#64748b"} 
                      strokeWidth="3" strokeDasharray="4 4"
                    />
                  </svg>

                  {/* Small sub-bone inputs */}
                  <div className={`absolute w-full px-4 space-y-6 ${cat.pos === 'top' ? 'top-14' : 'bottom-14'}`}>
                    {[0, 1].map(idx => (
                      <div key={idx} className="relative group">
                        <div className={`absolute -left-2 top-1/2 w-4 h-0.5 bg-slate-200 group-focus-within:bg-blue-400 transition-colors`} />
                        <input 
                          type="text" 
                          value={fishData[cause.id]?.[cat.id]?.[idx] || ""}
                          onChange={(e) => handleInputChange(cause.id, cat.id, idx, e.target.value)}
                          placeholder="Cause spécifique..." 
                          className="w-full bg-white/50 border-b-2 border-slate-100 px-2 py-1.5 text-[11px] focus:border-blue-500 focus:bg-white outline-none transition-all font-medium placeholder:text-slate-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAVE BAR */}
          <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Identifiez les facteurs influents pour cette cause
            </p>
            <button 
              onClick={() => saveIshikawa(cause.id, cause.text)}
              className="flex items-center gap-3 bg-slate-900 hover:bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
              ENREGISTRER <MdSave size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ishikawa;