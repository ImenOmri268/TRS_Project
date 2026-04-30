'use client';
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import ModifUtilisateur from "./ModifUtilisateur";

const TableUtilisateur = () => {
  const [openmodif, setopenmodif] = useState(false);

  return (
    <div className="w-full bg-white">
      
      <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 border-b border-slate-100">
        <span className="text-slate-700 font-semibold text-lg">Utilisateurs</span>
        
        <div className="relative w-full md:w-64">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2  focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">ID</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Nom et prénom</th>
              <th className="py-4 px-6 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Status</th>
              <th className="py-4 px-6 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Email</th>
              <th className="py-4 px-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Example Row for visualization */}
            <tr className="hover:bg-slate-50/80 transition-colors">
              <td className="py-4 px-6 text-sm text-slate-600">#001</td>
              <td className="py-4 px-6 text-sm font-medium text-slate-900">John Doe</td>
              <td className="py-4 px-6 text-center">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Actif
                </span>
              </td>
              <td className="py-4 px-6 text-sm text-slate-600">john@example.com</td>
              <td className="py-4 px-6 text-right space-x-3">
                <button className="text-slate-400 hover:text-blue-600 transition-colors" onClick={() => setopenmodif(true)}>
                  <FaRegEdit />
                </button>
                <ModifUtilisateur openmodif={openmodif} setopenmodif={() => setopenmodif(false)}/>
                <button className="text-slate-400 hover:text-red-600 transition-colors">
                  <FaRegTrashAlt />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableUtilisateur;  