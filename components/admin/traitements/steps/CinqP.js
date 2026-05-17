'use client'
import React, { useState, useEffect } from "react";
import { MdHelpOutline, MdOutlinePsychology, MdSave, MdCheckCircle } from "react-icons/md";

const CinqP = ({ workflowId }) => {
  const [topProblems, setTopProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const initializeData = async () => {
      const numericId = parseInt(workflowId);
      if (!numericId) return;

      try {
        // 1. Fetch Brainstorming to get the top 2 problems
        const brainRes = await fetch(`/api/admin/analyses?workflowId=${numericId}&type=BRAINSTORMING`);
        const brainData = await brainRes.json();
        
        let sorted = [];
        // Handle array response from findMany
        if (brainData && brainData.length > 0 && brainData[0].contenu) {
          const allProblems = JSON.parse(brainData[0].contenu);
          sorted = allProblems
            .sort((a, b) => Number(b.frequency) - Number(a.frequency))
            .slice(0, 2);
          setTopProblems(sorted);
        }

        // 2. Fetch existing 5 Whys to populate inputs if they exist
        const whyRes = await fetch(`/api/admin/analyses?workflowId=${numericId}&type=CINQ_POURQUOI`);
        const whyData = await whyRes.json();

        const initialResponses = {};
        // Initialize with empty whys first
        sorted.forEach(p => {
          initialResponses[p.id] = ["", "", "", "", ""];
        });

        // Overlay existing saved whys from the DB
        if (whyData && whyData.length > 0) {
          whyData.forEach(analysis => {
            const parsed = JSON.parse(analysis.contenu);
            if (initialResponses[parsed.problemId]) {
              initialResponses[parsed.problemId] = parsed.whys;
            }
          });
        }
        
        setResponses(initialResponses);
      } catch (err) {
        console.error("Error initializing 5 Whys:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [workflowId]);

  const handleInputChange = (probId, index, value) => {
    setResponses(prev => ({
      ...prev,
      [probId]: prev[probId].map((val, i) => (i === index ? value : val))
    }));
  };

  const handleSaveAnalyse = async (probId, probTitle) => {
    const numericId = parseInt(workflowId);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: numericId, // Integer
          type: "CINQ_POURQUOI",
          contenu: JSON.stringify({
            problemId: probId,
            problemTitle: probTitle,
            whys: responses[probId]
          })
        })
      });
      
      if (response.ok) {
        alert(`Analyse enregistrée avec succès !`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-bold text-slate-400 text-xs uppercase">Analyse des priorités...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <MdOutlinePsychology className="text-blue-600" size={32} /> Méthode des 5 Pourquoi
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Workflow #{workflowId} : Creusez jusqu&apos;à la racine des problèmes majeurs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {topProblems.map((prob, idx) => (
          <div key={prob.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 group relative">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Axe Prioritaire #0{idx + 1}</span>
                <h3 className="font-bold text-slate-800 text-lg mt-1 leading-tight">
                   {prob.text}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                <MdHelpOutline size={24} />
              </div>
            </div>

            <div className="space-y-6">
              {responses[prob.id]?.map((text, i) => (
                <div key={i} className="relative pl-10">
                  {i < 4 && <div className="absolute left-[11px] top-8 w-0.5 h-10 bg-slate-100" />}
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 mb-1">
                        <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                          i === 4 ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-white border-slate-200 text-slate-400"
                        }`}>
                          {i + 1}
                        </div>
                        <label className={`text-[10px] font-black uppercase tracking-widest ${i === 4 ? "text-emerald-600" : "text-slate-400"}`}>
                            {i === 4 ? "Cause Racine (Solution ciblée)" : `Pourquoi n°${i + 1} ?`}
                        </label>
                    </div>
                    
                    <input 
                      type="text"
                      value={text}
                      onChange={(e) => handleInputChange(prob.id, i, e.target.value)}
                      className={`w-full border rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                        i === 4 
                        ? "bg-emerald-50/30 border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 text-emerald-700 font-bold" 
                        : "bg-slate-50/50 border-slate-100 focus:border-blue-300 text-slate-600"
                      }`}
                      placeholder={i === 4 ? "Source fondamentale..." : "Définissez la cause..."}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
              <button 
                onClick={() => handleSaveAnalyse(prob.id, prob.text)}
                disabled={saving || !responses[prob.id]?.[4]}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-20"
              >
                <MdSave size={18} /> {saving ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {topProblems.length === 0 && (
        <div className="p-20 bg-slate-50 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
           <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">En attente de l&apos;analyse Pareto</p>
        </div>
      )}
    </div>
  );
};

export default CinqP;