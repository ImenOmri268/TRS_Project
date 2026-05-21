'use client'
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { MdOutlinePlaylistAddCheck } from "react-icons/md";

const ActionTable = ({ actions, onActionClick, onEditClick, onDeleteClick }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "A_FAIRE": return "bg-orange-100 text-orange-700 border-orange-200"
      case "TERMINE": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "EN_COURS": return "bg-blue-100 text-blue-700 border-blue-200";
      case "EN_RETARD": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <MdOutlinePlaylistAddCheck className="text-blue-600" size={24} /> 
          Journal des actions
        </h3>
      </div>
      
      <div className="overflow-x-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">titre</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((action) => (
              <tr 
                key={action.id} 
                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4" onClick={() => onActionClick(action)}>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-tight">
                    {action.title}
                  </p>
                </td>
                <td className="px-6 py-4" onClick={() => onActionClick(action)}>
                  <p className="text-xs font-bold text-slate-600">{action.user?.name || "Non assigné"}</p>
                </td>
                <td className="px-6 py-4 text-center" onClick={() => onActionClick(action)}>
                  <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(action.statut)}`}>
                    {action.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 ">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEditClick(action); }}
                      className="p-2 bg-white border border-slate-100 hover:border-blue-200 text-slate-400 hover:text-blue-600 rounded-xl shadow-sm transition-all"
                    >
                      <FaRegEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteClick(action.id); }}
                      className="p-2 bg-white border border-slate-100 hover:border-red-200 text-slate-400 hover:text-red-600 rounded-xl shadow-sm transition-all"
                    >
                      <FaRegTrashAlt size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {actions.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-slate-300 font-bold text-xs uppercase tracking-widest">Aucune action pour ce plan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionTable;