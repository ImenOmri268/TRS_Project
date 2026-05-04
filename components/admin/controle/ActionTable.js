'use client'
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa"; // Added Trash Icon

const ActionTable = ({ actions, onActionClick, onEditClick, onDeleteClick }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Terminé": return "bg-emerald-100 text-emerald-700";
      case "En Cours": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Journal des Réalisations</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Action</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Priorité</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Impact TRS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right px-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((action) => (
              <tr 
                key={action.id} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <td className="px-5 py-4" onClick={() => onActionClick(action)}>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{action.title}</p>
                  <p className="text-[10px] text-slate-400">{action.date}</p>
                </td>
                <td className="px-6 py-4" onClick={() => onActionClick(action)}>
                  <span className="text-xs font-medium text-slate-500">{action.priority}</span>
                </td>
                <td className="px-6 py-4" onClick={() => onActionClick(action)}>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(action.status)}`}>
                    {action.status}
                  </span>
                </td>
                <td className="px-6 py-4" onClick={() => onActionClick(action)}>
                  <span className={`text-sm font-black ${action.impact.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {action.impact}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClick(action);
                    }}
                    className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                  >
                    <FaRegEdit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(action.id);
                    }}
                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                  >
                    <FaRegTrashAlt size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionTable;