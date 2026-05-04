'use client'
import React from "react";

const TRSComparison = () => {
    const AdminTrs={
        initial: 68,
        current: 71.7,
        gain: 5.4
    }
  return (
    <div className="bg-slate-900 text-white p-8 rounded-3xl h-full border border-slate-800 shadow-xl">
      <h3 className="text-lg font-bold mb-6">Évolution Performance</h3>
      
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-400">TRS Initial</span>
            <span>{AdminTrs.initial}%</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-slate-500 h-full w-[68%]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-blue-400 font-bold">TRS Actuel (Après Actions)</span>
            <span className="text-blue-400">{AdminTrs.current}%</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[71.7%] shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
      </div>

      <div className="mt-10 p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Gain de productivité</p>
        <p className="text-3xl font-black text-emerald-400">+{(AdminTrs.current - AdminTrs.initial).toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default TRSComparison;