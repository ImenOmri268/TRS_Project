'use client'
import React, { useState } from "react";
import { MdAutoAwesome, MdSend, MdLightbulbOutline } from "react-icons/md";
import { motion } from "framer-motion";

const AiActions = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full border border-slate-800">
      <div className="p-6 border-b border-slate-800 bg-slate-800/30">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MdAutoAwesome className="text-amber-400 animate-pulse" />
          Assistant Intelligent TRS
        </h3>
        <p className="text-xs text-slate-400 mt-1">Générez des recommandations basées sur vos analyses Ishikawa.</p>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-4">
        {prompt === "" ? (
          <div className="space-y-2 opacity-40">
            <MdLightbulbOutline size={48} className="mx-auto text-slate-500" />
            <p className="text-slate-400 text-sm">Décrivez votre problème pour obtenir des solutions...</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left w-full">
             {/* This is where AI results would be mapped */}
          </motion.div>
        )}
      </div>

      <div className="p-6 bg-slate-800/50">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex: Propose-moi un plan d'action pour réduire les pannes du Capteur B2..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none min-h-[120px]"
          />
          <button className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shadow-lg">
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiActions;
