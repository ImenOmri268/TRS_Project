import React from "react";
import { HiOutlineArrowTrendingUp } from "react-icons/hi2";
import { useRouter } from "next/navigation";

const UserTRSComparisonTable = ({ machines, loading }) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Suivi des Lignes de Production</h3>
          <p className="text-xs text-slate-500 font-medium">Visualisation de vos indicateurs opérationnels en temps réel</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/70">
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
                <td colSpan="6" className="py-12 text-center text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">Chargement de vos ressources...</td>
              </tr>
            ) : machines.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-xs text-slate-400 font-medium">Aucune machine assignée à votre espace de travail.</td>
              </tr>
            ) : (
              machines.map((item) => {
                const initialValue = item.trsInitial || 0;
                const finalValue = item.trsFinal || 0;
                const targetValue = item.objectif || 0;
                const progress = (finalValue - initialValue).toFixed(1);
                const isMeetingTarget = finalValue >= targetValue && targetValue > 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{item.nom}</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mt-1 w-fit uppercase tracking-wide">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-mono text-slate-500">{initialValue}%</td>
                    <td className="py-4 px-6 text-center text-sm font-mono font-black text-blue-600">{finalValue}%</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 font-mono font-black text-xs ${parseFloat(progress) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        <HiOutlineArrowTrendingUp className={parseFloat(progress) < 0 ? "rotate-180" : ""} /> 
                        {progress > 0 ? `+${progress}` : progress}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-700 font-bold font-mono">
                      {targetValue > 0 ? `${targetValue}%` : "—"}
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

export default UserTRSComparisonTable;