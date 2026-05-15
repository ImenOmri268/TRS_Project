import React from "react";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";

const TRSComparisonTable = ({ machines, loading }) => {
  return (
    <div className="w-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Comparaison par Ressource</h3>
        <p className="text-sm text-slate-500">Analyse de la progression vers les objectifs cibles</p>
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
            {loading ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400 font-medium">Chargement des données...</td>
              </tr>
            ) : machines.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400 font-medium">Aucune donnée disponible</td>
              </tr>
            ) : (
              machines.map((item) => {
                // Calculation logic using your API keys
                const initialValue = item.trsInitial || 0;
                const finalValue = item.trsFinal || 0;
                const targetValue = item.objectif || 0;
                
                const progress = (finalValue - initialValue).toFixed(1);
                const isMeetingTarget = finalValue >= targetValue && targetValue > 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{item.nom}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-500">{initialValue}%</td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-blue-600">{finalValue}%</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs ${parseFloat(progress) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <HiOutlineArrowTrendingUp className={parseFloat(progress) < 0 ? "rotate-180" : ""} /> 
                        {progress > 0 ? `+${progress}` : progress}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-900 font-medium">
                      {targetValue > 0 ? `${targetValue}%` : "Non défini"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isMeetingTarget ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isMeetingTarget ? 'Objectif Atteint' : 'En progression'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TRSComparisonTable;