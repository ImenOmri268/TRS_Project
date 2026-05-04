'use client'
import React, { useState } from "react";
import { MdAddCircleOutline, MdOutlineDeleteSweep, MdClose, MdBarChart } from "react-icons/md";

const Brainstorming = () => {
  // Now using objects to store both the label and the frequency value
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           Brainstorming & Fréquences
        </h2>
        <p className="text-sm text-slate-500">
          Listez les problèmes et indiquez leur fréquence d&apos;occurrence pour générer le diagramme de Pareto.
        </p>
      </div>

      {/* Input List */}
      <div className="space-y-3">
        {problems.map((problem) => (
          <div key={problem.id} className="group flex items-center gap-3">
            {/* Problem Description */}
            <div className="relative flex-3">
              <input 
                value={problem.text}
                onChange={(e) => updateProblem(problem.id, 'text', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-slate-700"
                placeholder={`Problème #${problem.id}...`}
              />
            </div>

            {/* Frequency Input */}
            <div className="relative flex-1 min-w-30">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <MdBarChart size={18} />
              </div>
              <input 
                type="number"
                value={problem.frequency}
                onChange={(e) => updateProblem(problem.id, 'frequency', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-slate-700 font-bold"
                placeholder="Freq."
              />
            </div>
            
            {/* Inline Delete Button */}
            <button 
              onClick={() => removeProblem(problem.id)}
              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
              title="Supprimer"
            >
              <MdClose size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-2">
        <button 
          onClick={addProblem}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all active:scale-95"
        >
          <MdAddCircleOutline size={18} />
          Ajouter un problème
        </button>

        {problems.length > 0 && (
          <button 
            onClick={() => setProblems([])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 font-bold text-xs hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <MdOutlineDeleteSweep size={18} />
            Tout effacer
          </button>
        )}
      </div>
    </div>
  );
}

export default Brainstorming;