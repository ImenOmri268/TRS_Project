'use client'
import React, { useState } from "react";
import { MdAdd, MdAssignment, MdAccessTime } from "react-icons/md";

const ManualActions = () => {
  const [actions, setActions] = useState([]);
  
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <MdAssignment className="text-blue-600" />
          Actions Manuelles
        </h3>
        <p className="text-xs text-slate-500 mt-1">Créez et gérez vos propres correctifs TRS.</p>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          <input 
            type="text" 
            placeholder="Titre de l'action..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <input 
            type="text" 
            placeholder="Catégorie de l'action..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <div className="flex gap-3">
            <select className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none">
              <option>Priorité Haute</option>
              <option>Priorité Moyenne</option>
              <option>Priorité Basse</option>
            </select>
            <input 
              
              type="date" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none "
            />
          </div>
          <textarea 
            placeholder="Description détaillée de l'intervention..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm min-h-[100px] outline-none"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200">
          <MdAdd size={20} /> Ajouter l&apos;action
        </button>
      </div>
    </div>
  );
};

export default ManualActions;