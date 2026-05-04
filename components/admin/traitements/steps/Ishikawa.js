'use client'
import React from "react";
import { MdCheckCircle, MdOutlineSettingsInputComponent } from "react-icons/md";

const Ishikawa = () => {
  // These represent the root causes identified in the "5 Pourquoi" step
  const topCauses = [
    { id: 1, title: "Erreur Capteur B2", arrowColor: "" },
    { id: 2, title: "Coupure de courant",  arrowColor: "#f97316" }
  ];

  const categories = [
    { name: "Méthode", pos: "top", offset: "0%" },
    { name: "Environnement", pos: "top", offset: "33%" },
    { name: "Matériel", pos: "top", offset: "66%" },
    { name: "Matière", pos: "bottom", offset: "15%" },
    { name: "Main d'œuvre", pos: "bottom", offset: "50%" },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="px-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <MdOutlineSettingsInputComponent className="text-blue-600" />
          Diagramme d&apos;Ishikawa
        </h2>
        <p className="text-sm text-slate-500 mt-1">Analyse des causes racines par catégorie (5M).</p>
      </div>

      {topCauses.map((cause) => (
        <div key={cause.id} className="bg-slate-50/50 p-8 rounded-4xl border border-slate-200 shadow-sm relative overflow-x-auto custom-scrollbar">
          
          <div className="min-w-250 h-125 relative">
            
            {/* CENTRAL SPINE (The Main Horizontal Line) */}
            <div className="absolute top-1/2 left-0 w-[85%] h-0.75 bg-slate-400 -translate-y-1/2" />

            {/* THE PROBLEM HEAD (The Big Arrow) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
              <div className={`relative bg-blue-600 text-white px-10 py-6 min-w-[240px] text-center font-bold rounded-l-lg shadow-lg z-10`}>
                <span className="uppercase tracking-wide">{cause.title}</span>
                {/* SVG for the Arrow Point */}
                <div className="absolute top-0 -right-[39px] w-10 h-full overflow-hidden">
                   <svg width="40" height="80" viewBox="0 0 40 80">
                      <path d="M0 0 L40 40 L0 80 Z" fill="#2563eb" />
                   </svg>
                </div>
              </div>
            </div>

            {/* BONES & INPUTS */}
            {categories.map((cat, idx) => (
              <div 
                key={cat.name} 
                className="absolute w-[250px]"
                style={{ 
                  left: cat.offset, 
                  // Updated top position for bottom categories to place them lower
                  top: cat.pos === 'top' ? '10%' : '50%',
                  height: '40%'
                }}
              >
                <div className="flex flex-col items-center h-full relative">
                  
                  {/* Category Label (Top or Bottom) */}
                  <div className={`bg-blue-600 text-white px-6 py-2 rounded-lg text-[11px] font-bold shadow-md z-20 w-full text-center uppercase tracking-widest ${cat.pos === 'bottom' ? 'order-last mt-auto' : 'order-first mb-auto'}`}>
                    {cat.name}
                  </div>

                  {/* Diagonal Bone Line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line 
                      x1="50%" 
                      y1={cat.pos === 'top' ? '15%' : '85%'} 
                      x2={cat.pos === 'top' ? '100%' : '100%'} 
                      y2={cat.pos === 'top' ? '100%' : '0%'} 
                      stroke="#94a3b8" 
                      strokeWidth="2.5" 
                    />
                  </svg>

                  {/* Input Fields positioned along the "bones" */}
                  <div className={`absolute w-full space-y-8 ${cat.pos === 'top' ? 'top-10 pr-10' : 'bottom-10 pr-10'}`}>
                    <input 
                      type="text" 
                      placeholder="Cause..." 
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] focus:border-blue-500 outline-none shadow-sm italic text-slate-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Cause..." 
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] focus:border-blue-500 outline-none shadow-sm italic text-slate-500"
                    />
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* DASHBOARD ACTION BAR */}
          <div className="mt-8 flex justify-end items-center gap-6 border-t border-slate-200 pt-6">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 text-white px-8 py-2.5 rounded-xl font-bold text-xs transition-all hover:shadow-blue-200 active:scale-95">
              Validate <MdCheckCircle size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Ishikawa;