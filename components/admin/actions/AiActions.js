'use client'
import React, { useState } from "react";
import { MdAutoAwesome, MdSend, MdLightbulbOutline, MdCheckCircle } from "react-icons/md";
import { motion } from "framer-motion";

const AiActions = ({ planId }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerate = async () => {
    if (!prompt || !planId) return;
    setIsGenerating(true);
    
    try {
      // Logic: AI analyzes the prompt and returns a list of actions
      const response = await fetch("/api/admin/ai-generate", {
        method: "POST",
        body: JSON.stringify({ prompt, planId })
      });
      const data = await response.json();
      setSuggestions(data.actions); // Assuming AI returns an array
    } catch (error) {
      console.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-800">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MdAutoAwesome className="text-amber-400 animate-pulse" />
          Assistant Intelligent TRS
        </h3>
        <p className="text-xs text-slate-400 mt-1">Génère automatiquement des correctifs pour ton plan.</p>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {suggestions.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
            <div className="space-y-2 opacity-40">
              <MdLightbulbOutline size={48} className="mx-auto text-slate-500" />
              <p className="text-slate-400 text-sm">Décrivez le problème TRS pour obtenir des solutions IA...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             {suggestions.map((s, idx) => (
               <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={idx}
                className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center"
               >
                 <div className="text-slate-200 text-sm">{s.description}</div>
                 <MdCheckCircle className="text-emerald-500" size={20} />
               </motion.div>
             ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-800/50">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!planId || isGenerating}
            placeholder={planId ? "Ex: Propose-moi un plan pour réduire les pannes..." : "Veuillez d'abord créer un Plan..."}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none min-h-[120px]"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !planId}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shadow-lg disabled:opacity-50"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MdSend size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiActions;