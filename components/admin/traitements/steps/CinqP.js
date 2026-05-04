'use client'
import React from "react";
import { MdHelpOutline, MdOutlinePsychology, MdSubdirectoryArrowRight } from "react-icons/md";

const CinqP = () => {
  // Using the top two problems from the Pareto results
  const topProblems = [
    { id: 1, title: "Erreur Capteur B2" },
    { id: 2, title: "Coupure de courant" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MdOutlinePsychology className="text-blue-600" size={24} /> Les 5 Pourquoi
          </h2>
          <p className="text-sm text-slate-500">
            Analyse des causes racines pour les deux priorités majeures.
          </p>
        </div>
        <div className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest border-b-2 border-blue-500 pb-1">
          Méthodologie Lean
        </div>
      </div>

      {/* Grid Layout: Two forms next to each other on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {topProblems.map((prob, idx) => (
          <div 
            key={prob.id} 
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="mb-6">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                Analyse Priorité #0{idx + 1}
              </span>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mt-1">
                <MdHelpOutline className="text-blue-600 group-hover:rotate-12 transition-transform" /> 
                Problème : <span className="text-blue-600">{prob.title}</span>
              </h3>
            </div>

            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4">
                    {/* Visual Connector Line */}
                    {i < 5 && (
                      <div className="absolute left-[11px] top-8 w-[2px] h-6 bg-slate-100" />
                    )}
                    
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                      i === 5 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400"
                    }`}>
                      {i}
                    </div>

                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        {i === 5 ? "Cause Racine (Root Cause)" : `Pourquoi n°${i} ?`}
                      </label>
                      <div className="relative">
                        <input 
                          type="text"
                          className={`w-full bg-slate-50/50 border rounded-2xl px-5 py-3 text-sm outline-none transition-all ${
                            i === 5 
                            ? "border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-blue-700 font-medium" 
                            : "border-slate-100 focus:border-blue-400 focus:bg-white text-slate-600"
                          }`}
                          placeholder={i === 5 ? "Identifier la cause racine..." : "Expliquez pourquoi..."}
                        />
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end ">
              <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">
                Enregistrer l&apos;analyse
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Logic */}
      {topProblems.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
          <MdHelpOutline size={64} className="mb-4 opacity-10" />
          <p className="font-bold text-lg">En attente des données Pareto</p>
          <p className="text-sm">Veuillez identifier les problèmes majeurs pour commencer l&aposanalyse.</p>
        </div>
      )}
    </div>
  );
};

export default CinqP;