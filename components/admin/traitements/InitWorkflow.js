'use client'
import React, { useState, useEffect } from "react";
import { MdPlayArrow, MdSettings, MdAnalytics, MdRefresh } from "react-icons/md";

const InitWorkflow = ({ onStarted }) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
  });
  const [globalTrs, setGlobalTrs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(true);

  // Effect to calculate Global TRS automatically on mount
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const res = await fetch("/api/admin/stats/global-trs"); // You'll need this endpoint
        const data = await res.json();
        setGlobalTrs(data.averageTrs);
      } catch (err) {
        console.error("Erreur calcul TRS:", err);
      } finally {
        setCalculating(false);
      }
    };
    fetchGlobalStats();
  }, []);

  const handleStart = async () => {
    if (!formData.nom) return alert("Veuillez donner un nom à ce traitement.");
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          description: formData.description,
          valeurTrsGlobal: globalTrs, // Saving the calculated average
          dateDebut: new Date(),
          statut: "EN_COURS"
        })
      });

      if (res.ok) {
        const newWorkflow = await res.json();
        onStarted(newWorkflow); 
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <MdSettings size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Configuration du Traitement</h3>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Analyse Globale des Ressources</p>
          </div>
        </div>

        {/* Global TRS Preview Badge */}
        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center gap-2">
          <MdAnalytics className="text-blue-600" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-400 uppercase leading-none">TRS Global Actuel</span>
            <span className="text-sm font-black text-blue-700">
              {calculating ? "..." : `${globalTrs?.toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-2 block tracking-widest uppercase">Nom du Workflow</label>
            <input 
              type="text"
              placeholder="Ex: Plan de Redressement Q3 - Maintenance"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-2 block tracking-widest uppercase">Description du Contexte</label>
            <textarea 
              placeholder="Quels sont les axes d'amélioration identifiés sur l'ensemble du parc ?"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm min-h-[100px] outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button 
            onClick={handleStart}
            disabled={loading || calculating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <MdPlayArrow size={28} /> 
                <span className="text-lg">Démarrer le Pipeline d&apos;Amélioration</span>
              </>
            )}
          </button>
          
          <p className="text-center text-[11px] text-slate-400 mt-4 px-8 leading-relaxed">
            En démarrant ce workflow, vous initialisez une série d&apos;analyses (Ishikawa, Pareto, Brainstorming) basées sur la performance actuelle de <strong>toutes vos ressources</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitWorkflow;