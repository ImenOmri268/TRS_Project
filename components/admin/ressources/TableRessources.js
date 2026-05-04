'use client'
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import ModifRessource from "./ModifRessource";
import DetailsRessource from "./DetailsRessource";

const TableRessources = ({ ressources }) => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [ressourcesList, setRessourcesList] = useState(ressources);

  const handleDelete = (id) => {
      const ressource = ressourcesList.find(r => r.id === id);
      if(window.confirm(`Voulez-vous vraiment supprimer ${ressource.name} ?`)) {
        // Here changed by the delete logic
        setRessourcesList(ressourcesList.filter(res => res.id !== id));
      }
    };




  return (
    <div className="w-full bg-white">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6 gap-4 border-b border-slate-100 bg-slate-50/30">
        <span className="text-slate-800 font-black text-xl tracking-tight">Inventaire Technique</span>
        
        <div className="relative w-full md:w-80">
          <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input 
            type="text" 
            placeholder="Rechercher une ressource..." 
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
              <th className="py-4 px-6 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ressourcesList.map((ressource) => (
              <tr className="hover:bg-slate-50/80 transition-colors group" key={ressource.id}>
                <td className="py-5 px-6">
                  <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors block">{ressource.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{ressource.collection}</span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ressource.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {ressource.status}
                  </span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">{ressource.disponibilite}</span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-50 text-blue-600 border border-blue-100">{ressource.performance}</span>
                </td>
                <td className="py-5 px-6 text-center">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-600 border border-amber-100">{ressource.qualite}</span>
                </td>
                <td className="py-5 px-6 text-right space-x-2">
                  <button onClick={() => setSelectedResource(ressource)} className="p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    <FaRegEdit size={18} />
                  </button>
                  <button onClick={() => {handleDelete(ressource.id)}} className=" text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                    <FaRegTrashAlt size={18} />
                  </button>
                </td>
                <td className="py-5 px-6 text-right">
                  <button 
                    onClick={() => setSelectedDetails(ressource)}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-black text-[11px] uppercase tracking-tighter transition-all"
                  >
                    Détails <FaArrowRightLong />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModifRessource resourceData={selectedResource} setSelectedResource={() => setSelectedResource(null)} />
      <DetailsRessource resourceData={selectedDetails} setSelectedDetails={() => setSelectedDetails(null)} />
    </div>
  );
};

export default TableRessources;