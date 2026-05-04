import React from "react";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

const TRSComparisonTable = () => {
  const data = [
    { name: "Presse Hydraulique A1", initial: 60, final: 75, target: 80 },
    { name: "Machine CNC 05", initial: 70, final: 82, target: 85 },
    { name: "Robot Soudure B2", initial: 55, final: 78, target: 75 }, // Surpassed target
  ];

  return (
    <div className="w-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Comparaison par Ressource</h3>
        <p className="text-sm text-slate-500 ">Analyse de la progression vers les objectifs cibles</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Ressource</th>
              <th className="py-4 px-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">TRS Initial</th>
              <th className="py-4 px-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">TRS Final</th>
              <th className="py-4 px-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Progression</th>
              <th className="py-4 px-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Objectif Cible</th>
              <th className="py-4 px-6 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => {
              const progress = item.final - item.initial;
              const isMeetingTarget = item.final >= item.target;

              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-slate-500">{item.initial}%</td>
                  <td className="py-4 px-6 text-center text-sm font-bold text-blue-600">{item.final}%</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center gap-1 text-green-500 font-bold text-xs">
                      <HiOutlineArrowTrendingUp /> +{progress}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-sm text-slate-900 font-medium">{item.target}%</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      isMeetingTarget ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {isMeetingTarget ? 'Objectif Atteint' : 'En progression'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TRSComparisonTable;