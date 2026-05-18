'use client'
import React, { useState, useEffect } from "react";
import { MdClose, MdAssignment, MdPerson, MdDescription } from "react-icons/md";

const ActionCreate = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    description: "",
    planId: "",
    userId: "",
    statut: "EN_COURS"
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      // Fetching from your specific API routes
      const [plansRes, usersRes] = await Promise.all([
        fetch("/api/admin/plan-action"),
        fetch("/api/admin/utilisateurs") // This uses your provided Users API
      ]);

      const plansData = await plansRes.json();
      const usersData = await usersRes.json();

      // Based on your Plan API: it returns an array of plans
      setPlans(Array.isArray(plansData) ? plansData : []);
      
      // Based on your Users API: it returns formatted users {id, name, email...}
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error("Erreur lors du chargement des sélecteurs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.planId || !formData.userId) {
      alert("Veuillez sélectionner un plan et un responsable.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Ensure IDs are sent as numbers for Prisma
        body: JSON.stringify({
          ...formData,
          planId: parseInt(formData.planId),
          userId: parseInt(formData.userId)
        }),
      });

      if (res.ok) {
        setFormData({ description: "", planId: "", userId: "", statut: "EN_COURS" });
        onSuccess(); // Triggers refresh in MonitoringPage
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      console.error("Erreur submission:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nouvelle Action</h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Initialiser un correctif terrain</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* SELECT PLAN */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Dossier Source (Plan d&apos;action)
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
                    [{p.workflow?.nom || 'Global'}] {p.description}
                  </option>
                ))}
              </select>
              <MdAssignment className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* SELECT USER */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Responsable Assigné
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
                    {u.name} — {u.userRole || 'Opérateur'}
                  </option>
                ))}
              </select>
              <MdPerson className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
              Objectif / Description de l&apos;action
            </label>
            <div className="relative">
              <textarea 
                required
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700 placeholder:text-slate-300"
                placeholder="Décrivez précisément l'action corrective à mener..."
              />
              <MdDescription className="absolute right-5 bottom-5 text-slate-200" size={24} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50 uppercase text-xs tracking-[0.2em]"
          >
            {loading ? "Traitement en cours..." : "Valider l'affectation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActionCreate;