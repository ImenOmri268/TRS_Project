'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdClose, MdSettings, MdEditAttributes, MdToggleOn, MdToggleOff } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const ModifRessource = ({ resourceData, setSelectedResource, refresh }) => {
  const isOpen = !!resourceData;

  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    statut: true,
  });

  const [params, setParams] = useState([]);

  useEffect(() => {
    if (resourceData) {
      setFormData({
        nom: resourceData.nom || "",
        type: resourceData.type || "",
        statut: resourceData.statut ?? true 
      });
      setParams(resourceData.parameters || []);
    }
  }, [resourceData]);

  const handleParamChange = (id, newLabel) => {
    setParams(prev => prev.map(p => p.id === id ? { ...p, label: newLabel } : p));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/admin/ressources`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: resourceData.id,
          ...formData,
          parameters: params
        })
      });

      if (response.ok) {
        refresh();
        setSelectedResource(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const getParamsByCategory = (cat) => params.filter(p => p.category === cat);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={() => setSelectedResource(null)} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]" 
          />
          
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[160] flex flex-col"
          >
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MdSettings size={24} /></div>
                <h2 className="text-xl font-bold text-slate-900">Configuration</h2>
              </div>
              <button onClick={() => setSelectedResource(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* STATUS TOGGLE */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-700">Statut de la ressource</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                    {formData.statut ? "Visible sur le tableau" : "Masqué / Désactivé"}
                  </p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, statut: !formData.statut})}
                  className={`text-4xl transition-colors ${formData.statut ? "text-emerald-500" : "text-slate-300"}`}
                >
                  {formData.statut ? <MdToggleOn /> : <MdToggleOff />}
                </button>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Nom de la Ressource</label>
                <input
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block">Type / Catégorie</label>
                <input
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none font-semibold"
                />
              </div>

              {/* Parameter Labels */}
              <div className="pt-4 border-t border-slate-100 space-y-6 text-left">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <MdEditAttributes className="text-amber-500 text-xl" /> Libellés des calculs
                </h3>

                {['DISPONIBILITE', 'PERFORMANCE', 'QUALITE'].map((cat) => (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase ml-1">{cat}</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {getParamsByCategory(cat).map((param) => (
                        <div key={param.id} className="relative">
                          <input
                            value={param.label}
                            onChange={(e) => handleParamChange(param.id, e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:border-blue-500 focus:bg-white transition-all font-medium outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button onClick={() => setSelectedResource(null)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                <IoReturnUpBack /> Annuler
              </button>
              <button 
                onClick={handleUpdate}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Sauvegarder
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModifRessource;