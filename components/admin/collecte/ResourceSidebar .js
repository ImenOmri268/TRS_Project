import React from "react";
import { MdArrowForwardIos } from "react-icons/md";

const ResourceSidebar = ({ resources, selectedId, onSelect, loading }) => {
  if (loading) return <div className="text-slate-400 text-sm">Chargement...</div>;

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
        Ressources disponibles
      </h3>
      <div className="space-y-2">
        {resources.map((res) => (
          <button
            key={res.id}
            onClick={() => onSelect(res.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
              selectedId === res.id 
              ? "bg-blue-50 border-blue-200 shadow-sm" 
              : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
            }`}
          >
            <div className="text-left">
                <p className={`text-sm font-bold ${selectedId === res.id ? "text-blue-700" : "text-slate-700"}`}>
                    {res.nom}
                </p>
              <p className="text-[10px] text-slate-400 uppercase">{res.type}</p>
            </div>
            {selectedId === res.id && <MdArrowForwardIos className="text-blue-400 text-xs" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResourceSidebar;