'use client'
import React, { useState } from "react";
import { MdAddCircleOutline, MdOutlineDeleteSweep, MdClose, MdBarChart, MdSave } from "react-icons/md";

const Brainstorming = ({ workflowId }) => {
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([
    { id: 1, text: "", frequency: "" },
    { id: 2, text: "", frequency: "" },
    { id: 3, text: "", frequency: "" },
  ]);

  const addProblem = () => {
    const nextId = problems.length > 0 ? Math.max(...problems.map(p => p.id)) + 1 : 1;
    setProblems([...problems, { id: nextId, text: "", frequency: "" }]);
  };

  const removeProblem = (id) => {
    setProblems(problems.filter(p => p.id !== id));
  };

  const updateProblem = (id, field, value) => {
    setProblems(problems.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSaveData = async () => {
    if (!workflowId) return alert("Erreur: Aucun workflow actif trouvé.");
    
    // Filter out empty rows
    const validProblems = problems.filter(p => p.text.trim() !== "" && p.frequency !== "");
    
    if (validProblems.length === 0) return alert("Veuillez remplir au moins un problème avec sa fréquence.");

    setLoading(true);
    try {
      const response = await fetch("/api/admin/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: workflowId,
          type: "BRAINSTORMING",
          // We save the array as a stringified JSON in the 'contenu' field of your schema
          contenu: JSON.stringify(validProblems)
        }),
      });

      if (response.ok) {
        alert("Données de brainstorming enregistrées !");
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Brainstorming & Fréquences
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Identifiez les causes potentielles impactant le TRS Global #{workflowId}
          </p>
        </div>
        
        <button 
          onClick={handleSaveData}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
        >
          {loading ? "..." : <><MdSave size={20} /> Sauvegarder</>}
        </button>
      </div>

      {/* Input List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {problems.map((problem) => (
          <div key={problem.id} className="group flex items-center gap-3">
            {/* Problem Description */}
            <div className="relative flex-[3]">
              <input 
                value={problem.text}
                onChange={(e) => updateProblem(problem.id, 'text', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-slate-700 font-medium"
                placeholder="Description de la cause / du problème..."
              />
            </div>

            {/* Frequency Input */}
            <div className="relative flex-1 min-w-[120px]">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <MdBarChart size={20} />
              </div>
              <input 
                type="number"
                value={problem.frequency}
                onChange={(e) => updateProblem(problem.id, 'frequency', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm text-slate-900 font-black"
                placeholder="Nbr."
              />
            </div>
            
            {/* Inline Delete Button */}
            <button 
              onClick={() => removeProblem(problem.id)}
              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shrink-0"
            >
              <MdClose size={22} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
        <div className="flex items-center gap-3">
            <button 
              onClick={addProblem}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-blue-600 font-bold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
            >
              <MdAddCircleOutline size={20} />
              Ajouter une ligne
            </button>

            {problems.length > 0 && (
              <button 
                onClick={() => setProblems([{ id: 1, text: "", frequency: "" }])}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-slate-400 font-bold text-xs hover:text-red-500 transition-all"
              >
                <MdOutlineDeleteSweep size={20} />
                Réinitialiser
              </button>
            )}
        </div>
        
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {problems.filter(p => p.text !== "").length} Causes identifiées
        </div>
      </div>
    </div>
  );
}

export default Brainstorming;