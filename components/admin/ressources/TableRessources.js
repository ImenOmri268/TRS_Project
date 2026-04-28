'use client'
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import ModifRessource from "./ModifRessource";
import DetailsRessource from "./DetailsRessource";

const TableRessources = () => {
  const [openModif, setOpenModif] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  return (
    <div className="w-full bg-white">
      {/* Header section with search */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 border-b border-slate-100">
        <span className="text-slate-700 font-semibold text-lg">Liste des Ressources</span>
        <div className="relative w-full md:w-64">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Nom Ressource</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Disponibilité</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Performance</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Qualité</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Actions</th>
              <th className="py-4 px-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50/80 transition-colors group">
              <td className="py-4 px-6">
                <span className="text-sm font-semibold text-slate-900 block">Presse Hydraulique A1</span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Machine</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Actif</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-600 border border-green-100">92%</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">85%</span>
              </td>
              <td className="py-4 px-6 text-center">
                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">98%</span>
              </td>
              
              <td className="py-4 px-6 text-center space-x-3">
                <button className="text-slate-400 hover:text-blue-600 transition-colors" onClick={() => setOpenModif(true)}>
                  <FaRegEdit />
                </button>
                <button className="text-slate-400 hover:text-red-600 transition-colors">
                  <FaRegTrashAlt />
                </button>
              </td>
              <td className="py-4 px-6 text-center">
                <button 
                  onClick={() => setOpenDetails(true)}
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium text-xs transition-colors"
                >
                  Voir details<FaArrowRightLong />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ModifRessource openmodif={openModif} setopenmodif={() => setOpenModif(false)} />
      <DetailsRessource open={openDetails} setOpen={() => setOpenDetails(false)} />
    </div>
  );
};

export default TableRessources;