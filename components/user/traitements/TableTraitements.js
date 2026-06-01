'use client';
import React from "react";
import { FiCalendar, FiFileText } from "react-icons/fi";
import { GiGearHammer } from "react-icons/gi";

const TableTraitements = ({ workflows, onOuvrirTraitement }) => {

  const statusStyle = {
    EN_COURS: "bg-blue-50 text-blue-700 border-blue-100",
    TERMINE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    STOPPE: "bg-slate-100 text-slate-600 border-slate-200"
  };

  const identification = "IDENTPROBLEME";

  const badgeAnalyseStyle = {
    IDENTPROBLEME: "bg-purple-50 text-purple-600 border-purple-100",
    PARETO: "bg-orange-50 text-orange-600 border-orange-100",
    CINQ_POURQUOI: "bg-sky-50 text-sky-600 border-sky-100",
    ISHIKAWA: "bg-teal-50 text-teal-600 border-teal-100"
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/70">
              <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Traitement / Workflow</th>
              <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Ressource Impliquée</th>
              <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Analyses Effectuées</th>
              <th className="py-4 px-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">actions requises</th>
              <th className="py-4 px-6 border-b border-slate-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workflows && workflows.map((w) => {
              // Calcul dynamique sécurisé du nombre total d'actions reçues
              const count = w.planAction?._count?.actions || w.planAction?.actions?.length || 0;

              return (
                <tr key={w.id} className="hover:bg-slate-50/40 transition-colors group">
                  {/* Nom du traitement */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{w.nom}</span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5 font-mono">
                        <FiCalendar size={12} />
                        Lancé le {new Date(w.dateDebut).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>

                  {/* Ressource cible */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-700">{w.ressource?.nom}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{w.ressource?.type}</span>
                    </div>
                  </td>

                  {/* Étapes d'analyse */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {/* FIXED LOGIC: Check for > 0 instead of > 1 so single analysis blocks show correctly */}
                      {w.analyse && w.analyse.length > 0 ? (
                        w.analyse.map((a) => (
                          a.type === 'BRAINSTORMING' ? (
                            <span key={a.id} className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-md uppercase tracking-wide ${badgeAnalyseStyle[identification] || 'bg-slate-50 text-slate-600'}`}>
                              {identification.replace('_', ' ')}
                            </span>
                          ) : (
                            <span key={a.id} className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-md uppercase tracking-wide ${badgeAnalyseStyle[a.type] || 'bg-slate-50 text-slate-600'}`}>
                              {a.type.replace('_', ' ')}
                            </span>
                          )
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic"></span>
                      )}
                    </div>
                  </td>

                  {/* Compteur plan d'actions */}
                  <td className="py-4 px-6 text-center">
                    {count > 0 ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold font-mono border border-slate-200/60 shadow-2xs">
                        <GiGearHammer className="text-slate-500 animate-pulse" />
                        {count} {count > 1 ? "actions" : "action"}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 font-medium italic">Pas de plan</span>
                    )}
                  </td>

                  {/* Bouton d'action */}
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onOuvrirTraitement(w); 
                      }}
                      title={w.pdfUrl ? "Ouvrir la dernière version du rapport" : "Aucun rapport généré"}
                      className={`p-2.5 rounded-xl transition-all border inline-flex items-center justify-center cursor-pointer ${
                        w.pdfUrl 
                          ? "bg-slate-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white" 
                          : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                      }`}
                    >
                      <FiFileText size={16} />
                    </button>
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

export default TableTraitements;