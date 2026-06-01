'use client'
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import ModifRessource from "@/components/user/ressources/ModifRessource";
import DetailsRessource from "@/components/user/ressources/DetailsRessource";

const TableRessources = ({ ressources, refresh, canModifier, canSupprimer }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRessources = ressources.filter(res =>
    res.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, nom) => {
    if (window.confirm(`Voulez-vous vraiment supprimer la ressource "${nom}" ?`)) {
      try {
        const res = await fetch(`/api/user/ressources?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          // Safe timeout synchronization block
          setTimeout(() => {
            refresh(); // Re-runs data pulls for both inventory rows and notification counts
          }, 300);
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }
    }
  };

  const getDisplayValue = (ressource, category) => {
    const latestMetric = ressource.metrics?.find(m => m.category === category);
    if (latestMetric) return `${latestMetric.valeur}%`;

    if (ressource.trs && ressource.trs.length > 0) {
      const field = category.toLowerCase();
      const val = ressource.trs[0][field]?.valeur;
      if (val !== undefined && val !== 0) return `${val}%`;
    }
    return "-";
  };

  return (
    <div className="w-full bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4 border-b border-slate-100 bg-slate-50/30">
        <span className="text-slate-800 font-black text-xl tracking-tight">Inventaire Technique</span>
        <div className="relative w-full md:w-80">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou type..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Ressource</th>
              <th className="py-4 px-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th className="py-4 px-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Disponibilité</th>
              <th className="py-4 px-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Performance</th>
              <th className="py-4 px-6 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Qualité</th>
              {(canModifier || canSupprimer) && (
                <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              )}
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRessources.map((ressource) => {
              const disp = getDisplayValue(ressource, 'DISPONIBILITE');
              const perf = getDisplayValue(ressource, 'PERFORMANCE');
              const qual = getDisplayValue(ressource, 'QUALITE');

              return (
                <tr className="hover:bg-slate-50/80 transition-colors group" key={ressource.id}>
                  <td className="py-5 px-6">
                    <span className="text-sm font-bold text-slate-800 block">{ressource.nom}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{ressource.type}</span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    {ressource.statut ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">Actif</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700">Inactif</span>
                    )}
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                      disp !== "-" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      {disp}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                      perf !== "-" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      {perf}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${
                      qual !== "-" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      {qual}
                    </span>
                  </td>
                  {(canModifier || canSupprimer) && (
                    <td className="py-5 px-6 text-right space-x-2">
                      {canModifier && (
                        <button onClick={() => setSelectedResource(ressource)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                          <FaRegEdit size={18} />
                        </button>
                      )}
                      {canSupprimer && (
                        <button onClick={() => handleDelete(ressource.id, ressource.nom)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                          <FaRegTrashAlt size={18} />
                        </button>
                      )}
                    </td>
                  )}
                  <td className="py-5 px-6 text-right">
                    <button
                      onClick={() => setSelectedDetails(ressource)}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-black text-[11px] uppercase tracking-tighter transition-all"
                    >
                      Détails <FaArrowRightLong />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {canModifier && (
        <ModifRessource
          resourceData={selectedResource}
          setSelectedResource={() => setSelectedResource(null)}
          refresh={refresh}
        />
      )}
      <DetailsRessource
        resourceData={selectedDetails}
        setSelectedDetails={() => setSelectedDetails(null)}
      />
    </div>
  );
};

export default TableRessources;