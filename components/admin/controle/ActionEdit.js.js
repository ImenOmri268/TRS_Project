'use client'
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdSave, MdPersonOutline, MdTitle, MdAccessTime, MdTrendingUp, MdFlag } from "react-icons/md";

const ActionEdit = ({ editingAction, onClose, onSuccess }) => {
  // 1. Structural state tracking all custom variables requested
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    statut: "A_FAIRE",
    priorite: "MOYEN",
    dateLimite: "",
    userId: ""
  });
  
  const [users, setUsers] = useState([]); 
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [saving, setSaving] = useState(false);

  // 2. Fetch platform users list on component mounting
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await fetch("/api/admin/utilisateurs"); 
        if (res.ok) {
          const data = await res.json();
          setUsers(data || []);
        }
      } catch (err) {
        console.error("Failed to load platform users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // 3. Re-seed multi-field state values safely whenever a new action target is loaded
  useEffect(() => {
    if (editingAction) {
      // Helper to format ISO DateTime to YYYY-MM-DD for standard input elements
      let formattedDate = "";
      if (editingAction.dateLimite) {
        formattedDate = new Date(editingAction.dateLimite).toISOString().split('T')[0];
      }

      setFormData({
        title: editingAction.title || "",
        description: editingAction.description || "",
        statut: editingAction.statut || "A_FAIRE",
        priorite: editingAction.priorite || "MOYEN",
        dateLimite: formattedDate,
        userId: editingAction.userId ? editingAction.userId.toString() : ""
      });
    }
  }, [editingAction]);

  if (!editingAction) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingAction.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          statut: formData.statut,
          priorite: formData.priorite,
          dateLimite: formData.dateLimite ? new Date(formData.dateLimite).toISOString() : null,
          userId: formData.userId !== "" ? parseInt(formData.userId, 10) : null
        })
      });

      if (res.ok) {
        alert("Action mise à jour avec succès !");
        if (typeof onSuccess === "function") {
          onSuccess(); 
        }
      } else {
        const errData = await res.json();
        alert(`Erreur: ${errData.error || "Incapable de modifier l'action"}`);
      }
    } catch (err) {
      console.error("Error patching targeted action node:", err);
      alert("Erreur de connexion avec le serveur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] pointer-events-none">
        
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
        />

        {/* DRAWER PANEL */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto"
        >
          {/* HEADER */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Modifier l&apos;Action</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <MdClose size={24} />
            </button>
          </div>

          {/* CONTROL FORM PANEL */}
          <form onSubmit={handleSubmit} id="action-edit-form" className="flex-1 overflow-y-auto p-8 space-y-5">
            
            {/* TITLE */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Titre de l&apos;Action</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-700"
                />
                <MdTitle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description détaillée</label>
              <textarea 
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-slate-700 resize-none"
              />
            </div>

            {/* GRID LAYER FOR DATE AND TRS */}
            <div className="grid grid-cols-2 gap-4">
              {/* DATE LIMITE */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Limite</label>
                <div className="relative">
                  <input 
                    type="date" 
                    name="dateLimite"
                    required
                    value={formData.dateLimite}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              
            </div>

            {/* STATUS SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</label>
              <select 
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all"
              >
                <option value="A_FAIRE">À faire</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
                <option value="EN_RETARD">En retard</option>
              </select>
            </div>

            {/* PRIORITE SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priorité</label>
              <div className="relative">
                <select 
                  name="priorite"
                  value={formData.priorite}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none"
                >
                  <option value="BAS">Bas</option>
                  <option value="MOYEN">Moyen</option>
                  <option value="HAUT">Haut</option>
                </select>
                <MdFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            {/* RESPONSIBLE USER SELECT */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <MdPersonOutline size={14} /> Responsable Assigné
              </label>
              <select 
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                disabled={loadingUsers}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-60"
              >
                <option value="">Non assigné</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} — {user.email}
                  </option>
                ))}
              </select>
              {loadingUsers && (
                <p className="text-[10px] text-blue-500 font-medium animate-pulse">Chargement des membres...</p>
              )}
            </div>

          </form>

          {/* ACTION FOOTER */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/30">
            <button 
              type="submit"
              form="action-edit-form"
              disabled={saving}
              className="w-full bg-blue-600 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <MdSave size={20} /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default ActionEdit;