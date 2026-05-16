'use client'
import React, { useState } from "react";
import { MdOutlinePlaylistAddCheck, MdSettingsInputComponent, MdSave } from "react-icons/md";


const CollectForm = ({ resource }) => {
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  if (!resource) {
    return (
      <div className="h-full min-h-[300px] border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <MdSettingsInputComponent size={40} className="text-slate-200" />
        </div>
        <p className="font-medium">Aucune ressource sélectionnée</p>
      </div>
    );
  }

  // Handle Input changes
  const handleInputChange = (id, value) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Logic to save values into DailyValues
  const handleSaveCollecte = async () => {
    setLoading(true);
    
    // Prepare data for your PUT endpoint
    const dailyEntries = Object.entries(formValues).map(([paramId, val]) => ({
      parameterId: parseInt(paramId),
      value: val,
    }));

    try {
      const response = await fetch('/api/admin/ressources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resource.id,
          dailyEntries: dailyEntries
        }),
      });

      if (response.ok) {
        alert("Collecte enregistrée avec succès !"); // Or use toast.success
        setFormValues({}); // Clear inputs after save
      } else {
        const error = await response.json();
        alert(error.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  const parametersByCategory = resource.parameters?.reduce((acc, param) => {
    const cat = param.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(param);
    return acc;
  }, {}) || {};

  return (
    <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-8 space-y-8 flex flex-col">
      {/* Header without button */}
      <div className="flex items-center gap-3 mb-2">
        <MdOutlinePlaylistAddCheck className="text-blue-600 text-2xl" />
        <h3 className="text-lg font-bold text-slate-800">Saisie : {resource.nom}</h3>
      </div>

      <div className="space-y-8 flex-grow">
        {Object.keys(parametersByCategory).length > 0 ? (
          Object.entries(parametersByCategory).map(([category, params]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-l-2 border-blue-500 pl-3">
                Données de {category.toLowerCase()}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {params.map((param) => (
                  <div key={param.id} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                      {param.label}
                    </label>
                    <input 
                      type="number" 
                      value={formValues[param.id] || ""}
                      onChange={(e) => handleInputChange(param.id, e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm italic">
            Aucun paramètre configuré pour cette ressource.
          </div>
        )}
      </div>

      {/* Button placed at the bottom */}
      <div className="pt-6 border-t border-slate-200 flex justify-end">
        <button 
          onClick={handleSaveCollecte}
          disabled={loading || Object.keys(formValues).length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdSave className="text-lg" />
          {loading ? "Enregistrement..." : "Enregistrer votre collecte"}
        </button>
      </div>
    </div>
  );
};

export default CollectForm;