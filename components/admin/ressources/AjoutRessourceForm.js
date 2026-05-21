'use client'
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdClose, MdSettings, MdAnalytics, MdCheckCircle, MdMemory, MdCategory, MdEditAttributes, MdDescription, MdErrorOutline } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";

const AjoutRessourceForm = ({ isOpen, onClose, refresh, apiUrl='/api/admin/ressources' }) => {
  const scrollContainerRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    description: "",
    initialTRS: "",
    initialDisp: "",
    initialPerf: "",
    initialQual: ""
  });

  const [params, setParams] = useState({
    DISPONIBILITE: ["Temps Prévu", "Temps d'arrêts"],
    PERFORMANCE: ["Qté Produite Total", "Temps Unitaire Théorique"],
    QUALITE: ["Qté Produite Total", "Qté Rebut"]
  });

  const handleInputChange = (field, value) => {
    if (error) setError(""); 
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleParamChange = (category, index, value) => {
    if (error) setError("");
    const newCategoryParams = [...params[category]];
    newCategoryParams[index] = value;
    setParams(prev => ({ ...prev, [category]: newCategoryParams }));
  };

  const handleSubmit = async () => {
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

    // Validation: Ensure identification and all parameter labels are filled
    const allParamsFilled = Object.values(params).flat().every(label => label.trim() !== "");
    
    if (!formData.nom.trim() || !formData.type.trim() || !formData.description.trim() || !allParamsFilled) {
      setError("Champs obligatoires manquants. Veuillez vérifier l'identification et la configuration.");
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      errorTimeoutRef.current = setTimeout(() => {
        setError("");
      }, 4000);

      return;
    }

    try {
      // Map the dynamic labels to the format expected by the POST API
      const formattedParams = [
        ...params.DISPONIBILITE.map(label => ({ label, category: "DISPONIBILITE" })),
        ...params.PERFORMANCE.map(label => ({ label, category: "PERFORMANCE" })),
        ...params.QUALITE.map(label => ({ label, category: "QUALITE" }))
      ];

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nom: formData.nom,
          type: formData.type,
          description: formData.description,
          initialTRS: formData.initialTRS,
          initialDisp: formData.initialDisp,
          initialPerf: formData.initialPerf,
          initialQual: formData.initialQual,
          parameters: formattedParams 
        })
      });

      if (response.ok) {
        refresh(); // Refresh the table list
        onClose(); // Close modal
        // Reset state
        setFormData({ nom: "", type: "", description: "", initialTRS: "", initialDisp: "", initialPerf: "", initialQual: "" });
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la création.");
        errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}  
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* HEADER */}
              <div className="bg-white px-8 pt-6 pb-3 flex items-center justify-between border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Nouvelle Ressource</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">* Champs obligatoires</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* ERROR MESSAGE */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="bg-red-50 border-b border-red-100 w-full"
                  >
                    <div className=" px-8 py-3 flex items-center gap-5 text-red-600 text-sm font-semibold">
                      <MdErrorOutline className="text-xl shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CONTENT */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
              >
                {/* Identification */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identification *</h3>
                  <div className="grid gap-4">
                    <ModalInput icon={MdMemory} placeholder="Nom de la machine" value={formData.nom} onChange={(e) => handleInputChange('nom', e.target.value)} />
                    <ModalInput icon={MdCategory} placeholder="Type (ex: Laser, Presse...)" value={formData.type} onChange={(e) => handleInputChange('type', e.target.value)} />
                    <ModalInput icon={MdDescription} placeholder="Description technique..." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                  </div>
                </section>

                {/* Initial Values (Fallback) */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Valeurs Initiales (%) <span className="lowercase font-normal italic opacity-60">(Optionnel)</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <ModalInput icon={MdSettings} placeholder="TRS" type="number" value={formData.initialTRS} onChange={(e) => handleInputChange('initialTRS', e.target.value)} />
                    <ModalInput icon={MdSettings} placeholder="Disp." type="number" value={formData.initialDisp} onChange={(e) => handleInputChange('initialDisp', e.target.value)} />
                    <ModalInput icon={MdAnalytics} placeholder="Perf." type="number" value={formData.initialPerf} onChange={(e) => handleInputChange('initialPerf', e.target.value)} />
                    <ModalInput icon={MdCheckCircle} placeholder="Qual." type="number" value={formData.initialQual} onChange={(e) => handleInputChange('initialQual', e.target.value)} />
                  </div>
                </section>

                {/* Dynamic Configuration */}
                <section className="pt-6 border-t border-slate-100 space-y-6">
                  <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MdEditAttributes className="text-amber-500 text-xl" /> Configuration des paramètres *
                  </h3>

                  {Object.keys(params).map((cat) => (
                    <div key={cat} className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase ml-1">Champs {cat.toLowerCase()}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {params[cat].map((field, idx) => (
                          <input
                            key={`${cat}-${idx}`}
                            value={field}
                            onChange={(e) => handleParamChange(cat, idx, e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium shadow-sm"
                            placeholder="Libellé obligatoire"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <IoReturnUpBack size={20} /> Annuler
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <HiPlus size={20} /> Créer la Ressource
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalInput = ({ icon: Icon, ...props }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-blue-500 transition-all shadow-sm">
    <Icon className="text-xl text-slate-400" />
    <input className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300 text-sm" {...props} />
  </div>
);

export default AjoutRessourceForm;