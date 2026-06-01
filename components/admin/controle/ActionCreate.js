'use client'
import React, { useState, useEffect } from "react";
import { MdClose, MdAssignment, MdPerson, MdDescription, MdTitle, MdAccessTime, MdTrendingUp, MdFlag } from "react-icons/md";

const ActionCreate = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    planId: "",
    userId: "",
    priorite: "MOYEN",
    dateLimite: ""
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      const [plansRes, usersRes] = await Promise.all([
        fetch("/api/admin/plan-action"),
        fetch("/api/admin/utilisateurs")
      ]);

      const plansData = await plansRes.json();
      const usersData = await usersRes.json();

      setPlans(Array.isArray(plansData) ? plansData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Erreur lors du chargement des sélecteurs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.planId || !formData.userId || !formData.dateLimite) {
      alert("Veuillez renseigner tous les champs obligatoires (*).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          planId: parseInt(formData.planId, 10),
          userId: parseInt(formData.userId, 10),
          priorite: formData.priorite,
          dateLimite: new Date(formData.dateLimite).toISOString(),
        }),
      });

      if (res.ok) {
        // Reset state values on successful generation workflow
        setFormData({ 
          title: "", 
          description: "", 
          planId: "", 
          userId: "", 
          priorite: "MOYEN", 
          dateLimite: "" 
        });
        onSuccess(); 
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error("Erreur submission:", err);
      alert("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-full">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        
        {/* MODAL HEADER */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nouvelle Action</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Initialiser un correctif terrain</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        {/* MODAL BODY FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1 menu-scrollbar">
          
          {/* TITLE INPUT */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Titre de l&apos;action *
            </label>
            <div className="relative">
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="Ex: Optimisation convoyeur ligne B"
              />
              <MdTitle className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* PLAN D'ACTION SOURCE SELECT */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Plan d&apos;action à selectionner *
            </label>
            <div className="relative">
              <select 
                required
                value={formData.planId}
                onChange={(e) => setFormData({...formData, planId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none appearance-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="">Sélectionner le plan d&apos;action...</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <MdAssignment className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* ASSIGNED COLLABORATOR SELECT */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Utilisateur Assigné *
            </label>
            <div className="relative">
              <select 
                required
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none appearance-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="">Attribuer à un collaborateur...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.email}
                  </option>
                ))}
              </select>
              <MdPerson className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* DYNAMIC TWO COLUMN GRID FOR PRIORITY & TRS & DATE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LIMIT DATE */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                Date Limite *
              </label>
              <div className="relative">
                <input 
                  type="date"
                  required
                  value={formData.dateLimite}
                  onChange={(e) => setFormData({...formData, dateLimite: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700 uppercase"
                />
                <MdAccessTime className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
              </div>
            </div>

            {/* PRIORITE SELECTION */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Priorité
                </label>
                <div className="relative">
                  <select 
                    value={formData.priorite}
                    onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none appearance-none font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="BAS">Bas</option>
                    <option value="MOYEN">Moyen</option>
                    <option value="HAUT">Haut</option>
                  </select>
                  <MdFlag className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                </div>
              </div>


          </div>

          


          {/* DESCRIPTION */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Description détaillée de l&apos;action
            </label>
            <div className="relative">
              <textarea 
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700 placeholder:text-slate-300 resize-none"
                placeholder="Informations supplémentaires ou instructions de déploiement..."
              />
              <MdDescription className="absolute right-5 bottom-5 text-slate-200 pointer-events-none" size={24} />
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-[0.2em]"
            >
              {loading ? "Traitement en cours..." : "Valider l'affectation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActionCreate;