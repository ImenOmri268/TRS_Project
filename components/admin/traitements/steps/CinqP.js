'use client'
import React, { useState, useEffect } from "react";
import { MdHelpOutline, MdOutlinePsychology, MdSave, MdCheckCircle } from "react-icons/md";

const CinqP = ({ workflowId }) => {
  const [topProblems, setTopProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State to store the 5 why's for each problem
  // Structure: { [problemId]: ["why1", "why2", "why3", "why4", "why5"] }
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchTopProblems = async () => {
      if (!workflowId) return;
      try {
        const res = await fetch(`/api/admin/analyses?workflowId=${workflowId}&type=BRAINSTORMING`);
        const data = await res.json();
        if (data && data.contenu) {
          const allProblems = JSON.parse(data.contenu);
          // Sort by frequency and take the top 2
          const sorted = allProblems
            .sort((a, b) => Number(b.frequency) - Number(a.frequency))
            .slice(0, 2);
          setTopProblems(sorted);
          
          // Initialize empty responses for these problems
          const initialResponses = {};
          sorted.forEach(p => {
            initialResponses[p.id] = ["", "", "", "", ""];
          });
          setResponses(initialResponses);
        }
      } catch (err) {
        console.error("Error fetching Pareto data for 5 Why:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProblems();
  }, [workflowId]);

  const handleInputChange = (probId, index, value) => {
    setResponses(prev => ({
      ...prev,
      [probId]: prev[probId].map((val, i) => (i === index ? value : val))
    }));
  };

  const handleSaveAnalyse = async (probId, probTitle) => {
    setSaving(true);
    try {
      await fetch("/api/admin/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId,
          type: "CINQ_POURQUOI",
          contenu: JSON.stringify({
            problemId: probId,
            problemTitle: probTitle,
            whys: responses[probId]
          })
        })
      });
      alert(`Analyse enregistrée pour : ${probTitle}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Calcul des priorités...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <MdOutlinePsychology className="text-blue-600" size={32} /> Méthode des 5 Pourquoi
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Dégagez la cause racine des deux problèmes les plus impactants du Workflow #{workflowId}.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {topProblems.map((prob, idx) => (
          <div key={prob.id} className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-200 shadow-sm group relative">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Priorité #0{idx + 1}</span>
                <h3 className="font-bold text-slate-800 text-lg mt-1 leading-tight">
                  Problème : <span className="text-blue-600">{prob.text}</span>
                </h3>
              </div>
              <MdHelpOutline size={30} className="text-slate-200 group-hover:text-blue-200 transition-colors" />
            </div>

            <div className="space-y-6">
              {responses[prob.id]?.map((text, i) => (
                <div key={i} className="relative pl-8">
                  {/* Visual Line Connector */}
                  {i < 4 && <div className="absolute left-3 top-7 w-0.5 h-10 bg-slate-200" />}
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                          i === 4 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-400"
                        }`}>
                          {i + 1}
                        </div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {i === 4 ? "Cause Racine Finale" : `Pourquoi n°${i + 1} ?`}
                        </label>
                    </div>
                    
                    <input 
                      type="text"
                      value={text}
                      onChange={(e) => handleInputChange(prob.id, i, e.target.value)}
                      className={`w-full bg-white border rounded-2xl px-5 py-3.5 text-sm outline-none transition-all ${
                        i === 4 
                        ? "border-blue-200 focus:ring-4 focus:ring-blue-50 text-blue-700 font-bold" 
                        : "border-slate-200 focus:border-blue-400 text-slate-600 font-medium"
                      }`}
                      placeholder={i === 4 ? "Identifiez la source réelle..." : "Déduisez la cause de l'étape précédente..."}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
              <button 
                onClick={() => handleSaveAnalyse(prob.id, prob.text)}
                disabled={saving || !responses[prob.id][4]}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-30"
              >
                <MdSave size={18} /> {saving ? "Enregistrement..." : "Valider l'analyse"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {topProblems.length === 0 && (
        <div className="p-20 bg-slate-100 rounded-[3rem] text-center border-2 border-dashed border-slate-300">
           <p className="text-slate-400 font-bold uppercase tracking-widest">Aucune donnée Pareto disponible</p>
        </div>
      )}
    </div>
  );
};

export default CinqP;