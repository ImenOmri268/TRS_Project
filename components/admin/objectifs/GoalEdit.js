'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSave } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const GoalEdit = ({ editingGoal, onClose, refresh }) => {
  // Initialize state directly from props to avoid the "cascading render" warning
  const [formData, setFormData] = useState({
    title: editingGoal?.title || "",
    description: editingGoal?.description || "",
    valeurCible: editingGoal?.valeurCible?.toString() || "",
    dateFin: editingGoal?.dateFin ? editingGoal.dateFin.split('T')[0] : ""
  });

  // Sync state if the editingGoal prop changes while the component is mounted
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title || "",
        description: editingGoal.description || "",
        valeurCible: editingGoal.valeurCible?.toString() || "",
        dateFin: editingGoal.dateFin ? editingGoal.dateFin.split('T')[0] : ""
      });
    }
  }, [editingGoal]);

  const handleUpdate = async () => {
    try {
      const res = await fetch('/api/admin/objectifs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingGoal.id, 
          ...formData,
          // Ensure numeric value is sent correctly
          valeurCible: parseFloat(formData.valeurCible) 
        })
      });

      if (res.ok) {
        refresh();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <AnimatePresence>
      {editingGoal && (
        <>
          {/* Background Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]" 
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Modifier l&apos;Objectif</h3>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 p-8 space-y-6 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Titre:</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Valeur Cible (%)</label>
                <input 
                  type="number" 
                  value={formData.valeurCible} 
                  onChange={(e) => setFormData({...formData, valeurCible: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Échéance</label>
                <input 
                  type="date" 
                  value={formData.dateFin} 
                  onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-blue-500 transition-all" 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={onClose} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <IoReturnUpBack size={18} /> Annuler
              </button>
              <button 
                onClick={handleUpdate} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg transition-all active:scale-95"
              >
                <MdSave size={20} /> Enregistrer
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoalEdit;