'use client'
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdOutlineTrackChanges, MdOutlineFlag, MdOutlineEvent, MdOutlineDescription, MdErrorOutline } from "react-icons/md";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";
import ModalSelect from "./ModalSelect";

const AjoutGoalForm = ({ isOpen, onClose, refresh, ressourcesApiUrl='/api/admin/ressources' }) => {
  const [error, setError] = useState("");
  const errorTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    valeurCible: "",
    dateFin: "",
    ressourceId: ""
  });
  
  const [ressources, setRessources] = useState([]);
  const [isLoadingRessources, setIsLoadingRessources] = useState(false);

  const resetForm = () => {
    setError("");
    setFormData({
      title: "",
      description: "",
      valeurCible: "",
      dateFin: "",
      ressourceId: ressources.length > 0 ? ressources[0].id : "" 
    });
  };

  const fetchRessources = async () => {
    setIsLoadingRessources(true);
    try {
      const res = await fetch(ressourcesApiUrl);
      if (res.ok) {
        const data = await res.json();
        setRessources(data);
      }
    } catch (error) {
      console.error('Failed to fetch ressources:', error);
    } finally {
      setIsLoadingRessources(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRessources();
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (ressources.length > 0 && !formData.ressourceId) {
      setFormData(prev => ({ 
        ...prev, 
        ressourceId: ressources[0].id 
      }));
    }
  }, [ressources, formData.ressourceId]);

  const handleSubmit = async () => {
    // Clear existing timer
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

    // Validation
    if (!formData.title.trim() || !formData.valeurCible.trim() || !formData.dateFin || !formData.ressourceId) {
      setError("Champs obligatoires manquants. Veuillez remplir tous les champs marqués.");
      
      // Auto-scroll to top to see error
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Hide after 4 seconds
      errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
      return;
    }

    try {
      const res = await fetch('/api/admin/objectifs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (res.ok) {
        refresh(); 
        resetForm();
        onClose();
      } else {
        setError(data.message || "Erreur lors de la création");
        errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Erreur de connexion au serveur.");
      errorTimeoutRef.current = setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header */}
            <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <MdOutlineTrackChanges className="text-2xl text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Nouvel objectif</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">* Champs obligatoires</p>
                </div>
              </div>
              <button onClick={() => { resetForm(); onClose(); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose className="text-2xl text-slate-400" />
              </button>
            </div>

            {/* ERROR MESSAGE BAR */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-red-50 border-b border-red-100 w-full"
                >
                  <div className="px-8 py-3  items-center gap-3 text-red-600 text-sm font-semibold">
                    <MdErrorOutline className="text-xl shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Content */}
            <div 
              ref={scrollContainerRef}
              className="p-8 space-y-8 overflow-y-auto custom-scrollbar"
            >
              
              {/* Section: Définition */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Définition de l&apos;objectif *</h3>
                <div className="grid gap-4">
                  <ModalInput 
                    icon={MdOutlineTrackChanges} 
                    label="Titre" 
                    value={formData.title} 
                    onChange={(e) => { setError(""); setFormData({...formData, title: e.target.value})}}
                    placeholder="ex: Optimisation TRS Ligne B" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModalInput 
                      icon={MdOutlineFlag} 
                      label="Cible" 
                      placeholder="ex: 85% ou -15min" 
                      value={formData.valeurCible} 
                      onChange={(e) => { setError(""); setFormData({...formData, valeurCible: e.target.value})}}
                    />
                    <ModalInput 
                      icon={MdOutlineEvent} 
                      label="Échéance" 
                      type="date"
                      value={formData.dateFin} 
                      onChange={(e) => { setError(""); setFormData({...formData, dateFin: e.target.value})}}
                    />
                  </div>
                  <ModalSelect
                    icon={MdOutlineTrackChanges}
                    label="Ressource à sélectionner"
                    value={formData.ressourceId}
                    onChange={(e) => { setError(""); setFormData({...formData, ressourceId: parseInt(e.target.value)})}}
                    options={ressources}
                    isLoading={isLoadingRessources}
                  />
                </div>
              </section>

              {/* Section: Détails */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Détails & Contexte</h3>
                <div className="flex gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
                  <MdOutlineDescription className="text-2xl text-slate-400 mt-1" />
                  <textarea 
                    className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300 min-h-[120px] resize-none"
                    placeholder="Décrivez les étapes ou la méthodologie (ex: Méthode SMED, Analyse des causes...)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => { resetForm(); onClose(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <IoReturnUpBack size={20}/> Annuler
              </button>
              <button 
                onClick={handleSubmit} 
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                <HiPlus size={20}/> Créer l&apos;Objectif
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* Reusable Styled Input */
const ModalInput = ({ icon: Icon, label, ...props }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-blue-500 focus-within:bg-white transition-all shadow-sm">
    <Icon className="text-2xl text-slate-400 group-focus-within:text-blue-500 transition-colors" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300"
        {...props} 
      />
    </div>
  </div>
);

export default AjoutGoalForm;