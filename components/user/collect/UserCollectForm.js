'use client'
import React, { useState, useEffect } from "react";
import { MdOutlinePlaylistAddCheck, MdSettingsInputComponent, MdSave, MdCheckCircle } from "react-icons/md";

const UserCollectForm = ({ resource, onSuccess, apiUrl = '/api/user/ressources' }) => {
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormValues({});
    setShowSuccess(false);
  }, [resource?.id]);

  if (!resource) {
    return (
      <div className="h-full min-h-[450px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white/50">
        <div className="p-5 bg-slate-100 rounded-3xl mb-4 text-slate-300">
          <MdSettingsInputComponent size={48} />
        </div>
        <h4 className="text-slate-600 font-bold text-lg">Prêt pour la saisie</h4>
        <p className="text-sm max-w-[250px] mt-1">Sélectionnez une ressource dans la liste de gauche pour commencer.</p>
      </div>
    );
  }

  const handleInputChange = (id, value) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveCollecte = async () => {
    setLoading(true);
    const dailyEntries = Object.entries(formValues).map(([paramId, val]) => ({
      parameterId: parseInt(paramId),
      value: parseFloat(val) || 0,
    }));

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, dailyEntries: dailyEntries }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormValues({});
        setTimeout(() => setShowSuccess(false), 3000);
        if (onSuccess) onSuccess();
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

  const categories = ['DISPONIBILITE', 'PERFORMANCE', 'QUALITE'];
  const parametersByCategory = resource.parameters?.reduce((acc, param) => {
    const cat = param.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(param);
    return acc;
  }, {}) || {};

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col animate-in fade-in">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl">
              <MdOutlinePlaylistAddCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 leading-tight">Saisie Journalière</h3>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">
                {resource.nom} — {resource.type}
              </p>
            </div>
          </div>
          {showSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold animate-bounce">
              <MdCheckCircle /> Enregistré !
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-10">
        {categories.map((category) => {
          const params = parametersByCategory[category];
          if (!params) return null;
          return (
            <div key={category} className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="h-px bg-slate-200 flex-grow"></span>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  {category}
                </h4>
                <span className="h-px bg-slate-200 flex-grow"></span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {params.map((param) => (
                  <div key={param.id} className="group">
                    <label className="flex justify-between items-center mb-2 px-1">
                      <span className="text-xs font-bold text-slate-600 group-focus-within:text-blue-600 transition-colors uppercase">
                        {param.label}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={formValues[param.id] || ""}
                      onChange={(e) => handleInputChange(param.id, e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {Object.keys(parametersByCategory).length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm italic">Aucun paramètre trouvé.</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleSaveCollecte}
          disabled={loading || Object.keys(formValues).length === 0}
          className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl text-sm font-black shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <MdSave className="text-xl" />
          )}
          {loading ? "Calcul en cours..." : "Valider la production"}
        </button>
      </div>
    </div>
  );
};

export default UserCollectForm;