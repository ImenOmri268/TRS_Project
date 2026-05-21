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
      const response = await fetch("/api/admin/ai-generate", {
        method: "POST",
        body: JSON.stringify({ prompt, planId })
      });
      const data = await response.json();
      setSuggestions(data.actions); 
    } catch (error) {
      console.error("AI Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-800 min-h-[500px]">
      
      {/* HEADER SECTION: Responsive internal padding */}
      <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-800/30">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <MdAutoAwesome className="text-amber-400 flex-shrink-0 animate-pulse" />
          <span>Assistant Intelligent TRS</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">Génère automatiquement des correctifs pour ton plan.</p>
      </div>

      {/* WORKSPACE AREA: Dynamic container height tracking */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[400px] lg:max-h-none">
        {suggestions.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col justify-center items-center text-center space-y-4 p-4">
            <div className="space-y-2 opacity-40 max-w-xs">
              <MdLightbulbOutline size={40} className="mx-auto text-slate-500 sm:w-12 sm:h-12" />
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Décrivez le problème TRS pour obtenir des solutions IA...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
             {suggestions.map((s, idx) => (
               <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                key={idx}

                className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-start justify-between gap-3 transition-colors hover:border-slate-600"
               >
                 <div className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words flex-1">
                   {s.description}
                 </div>
                 <MdCheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
               </motion.div>
             ))}
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS AREA: Textarea overlap defense */}
      <div className="p-4 sm:p-6 bg-slate-800/50 border-t border-slate-800">
        <div className="relative flex items-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!planId || isGenerating}
            placeholder={planId ? "Ex: Propose-moi un plan pour réduire les pannes..." : "Veuillez d'abord créer un Plan..."}
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-4 pr-14 sm:pl-5 py-3.5 sm:py-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none min-h-[100px] sm:min-h-[120px] disabled:opacity-50 disabled:bg-slate-950/40"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !planId}
            className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 bg-blue-600 hover:bg-blue-500 disabled:hover:bg-blue-600 text-white p-2.5 sm:p-3 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MdSend size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiActions;