'use client'
import React from "react";
import { MdArrowForwardIos, MdCircle } from "react-icons/md";

const UserResourceSidebar = ({ resources, selectedId, onSelect, loading }) => {
  // Skeleton Loading State for a smoother UX
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse ml-1" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-slate-50 rounded-2xl animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
        Ressources disponibles
      </h3>
      
      <div className="space-y-2.5">
        {resources.length > 0 ? (
          resources.map((res) => (
            <button
              key={res.id}
              onClick={() => onSelect(res.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                selectedId === res.id 
                ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]" 
                : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Status Dot */}
                <MdCircle className={`text-[8px] ${
                  selectedId === res.id 
                  ? "text-blue-200" 
                  : res.statut ? "text-emerald-500" : "text-slate-300"
                }`} />

                <div className="text-left">
                  <p className={`text-sm font-bold transition-colors ${
                    selectedId === res.id ? "text-white" : "text-slate-700 group-hover:text-blue-600"
                  }`}>
                    {res.nom}
                  </p>
                  <p className={`text-[10px] font-medium uppercase tracking-tight transition-colors ${
                    selectedId === res.id ? "text-blue-100" : "text-slate-400"
                  }`}>
                    {res.type}
                  </p>
                </div>
              </div>

              <div className={`transition-transform duration-300 ${selectedId === res.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100"}`}>
                <MdArrowForwardIos className={`text-xs ${selectedId === res.id ? "text-white" : "text-blue-400"}`} />
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-sm text-slate-400 font-medium">Aucune ressource configurée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserResourceSidebar;