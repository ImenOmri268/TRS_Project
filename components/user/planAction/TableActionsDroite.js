'use client';
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiCheck, FiX, FiEdit2, FiInfo, FiAlertCircle, FiClock, FiCheckCircle } from "react-icons/fi";

// ─── NEW COMPONENT: ACTION DETAILS DRAWER ──────────────────────────────────
const ActionDetailsDrawer = ({ action, isOpen, onClose, priorityStyle, statusStyle }) => {
  if (!action) return null;

  return (
    <>
      {/* Backdrop overlay background */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sliding Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-100 shadow-2xl z-50 transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FiInfo className="text-slate-400" size={18} />
            <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">Détails de l'Action</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-76px)] custom-scrollbar">
          {/* Title Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Intitulé</span>
            <h4 className="text-lg font-bold text-slate-800 leading-snug">{action.title}</h4>
          </div>

          {/* Badges Layout GRID */}
          <div className="grid grid-cols-2 gap-4 border-y border-slate-100/80 py-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Priorité</span>
              <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-md uppercase tracking-wide ${priorityStyle[action.priorite]}`}>
                {action.priorite}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1.5">Statut Actuel</span>
              <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-black rounded-full uppercase tracking-wide ${statusStyle[action.statut]}`}>
                {action.statut.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Date section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Échéance de traitement</span>
            <div className="flex items-center gap-2 text-sm text-slate-700 font-bold font-mono bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 w-fit">
              <FiCalendar className="text-slate-400" size={16} />
              {new Date(action.dateLimite).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Consignes & Description</span>
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
              {action.description || 'Aucune consigne rédigée.'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── MAIN TABLE COMPONENT ──────────────────────────────────────────────────
const TableActionsDroite = ({ actions, refresh }) => {
  const [editingActionId, setEditingActionId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW STATES: For handling drawer view layer
  const [selectedActionForDrawer, setSelectedActionForDrawer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenForm = (action) => {
    setEditingActionId(action.id);
    setSelectedStatus(action.statut); 
  };

  const handleCancel = () => {
    setEditingActionId(null);
    setSelectedStatus("");
  };

  const handleOpenDrawer = (action) => {
    setSelectedActionForDrawer(action);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Timeout to clear action object only after animation slide transitions finish completely
    setTimeout(() => setSelectedActionForDrawer(null), 300);
  };

  const handleConfirmStatus = async (actionId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/plan-action/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: actionId, statut: selectedStatus })
      });

      if (res.ok) {
        toast.success("action modifiée avec succès !", {
          duration: 2000,
          style: {
            borderRadius: '15px',
            background: '#8BE78B',
            color: '#FFFFFF',
          },
        });
        setEditingActionId(null); 
        // Sync open drawer state context values dynamically if the edited object is actively rendered inside drawer
        if (selectedActionForDrawer?.id === actionId) {
          setSelectedActionForDrawer(prev => prev ? { ...prev, statut: selectedStatus } : null);
        }
        refresh(); 
      } else {
        alert("Une erreur est survenue lors de la modification.");
      }
    } catch (err) {
      console.error("Erreur mise à jour statut action", err);
    } finally {
      setLoading(false);
    }
  };

  const priorityStyle = {
    HAUT: "bg-rose-50 text-rose-600 border-rose-100",
    MOYEN: "bg-amber-50 text-amber-600 border-amber-100",
    BAS: "bg-slate-100 text-slate-600 border-slate-200"
  };

  const statusStyle = {
    A_FAIRE: "bg-slate-100 text-slate-700 border-slate-200",
    EN_COURS: "bg-blue-100 text-blue-700 border-blue-200",
    TERMINE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    EN_RETARD: "bg-rose-100 text-rose-700 border-rose-200 font-bold"
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/70">
              <th className="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action demandée</th>
              <th className="py-4 px-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Priorité</th>
              <th className="py-4 px-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date Limite</th>
              <th className="py-4 px-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {actions.map((action) => {
              const isEditing = editingActionId === action.id;

              return (
                <React.Fragment key={action.id}>
                  {/* LIGNE PRINCIPALE DE L'ACTION */}
                  <tr className={`transition-colors group ${isEditing ? 'bg-slate-50/80' : 'hover:bg-slate-50/30'}`}>
                    {/* MODIFIED: Left title click interaction opens the Side Drawer details cleanly */}
                    <td 
                      className="py-4 px-6 cursor-pointer"
                      onClick={() => handleOpenDrawer(action)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{action.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-0.5 border text-[10px] font-black rounded-md uppercase tracking-wide ${priorityStyle[action.priorite]}`}>
                        {action.priorite}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium font-mono">
                        <FiCalendar className="text-slate-400" />
                        {new Date(action.dateLimite).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Stop click bubbling up to open the drawer
                          handleOpenForm(action);
                        }}
                        className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer hover:scale-105 flex items-center justify-center gap-1.5 mx-auto ${statusStyle[action.statut]}`}
                      >
                        {action.statut.replace('_', ' ')}
                        <FiEdit2 className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px]" />
                      </button>
                    </td>
                  </tr>

                  {/* FORMULAIRE CONTEXTUEL */}
                  {isEditing && (
                    <tr className="bg-slate-50/80 animate-in slide-in-from-top-2 duration-200">
                      <td colSpan={4} className="py-3 px-6 border-b border-slate-200/60">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                          
                          {/* Gauche : Label et Sélecteur */}
                          <div className="flex items-center gap-3 flex-1">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider shrink-0">
                              Changer le statut :
                            </label>
                            <select
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                            >
                              <option value="A_FAIRE">À FAIRE</option>
                              <option value="EN_COURS">EN COURS</option>
                              <option value="TERMINE">TERMINÉ</option>
                              <option value="EN_RETARD">EN RETARD</option>
                            </select>
                          </div>

                          {/* Droite : Boutons d'actions */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={handleCancel}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FiX /> Annuler
                            </button>
                            
                            <button
                              onClick={() => handleConfirmStatus(action.id)}
                              disabled={loading}
                              className="px-4 py-1.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-600 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {loading ? "Mise à jour..." : (
                                <>
                                  <FiCheck size={14} />
                                  Confirmer
                                </>
                              )}
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DRAWER RENDER INJECTION */}
      <ActionDetailsDrawer 
        action={selectedActionForDrawer}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        priorityStyle={priorityStyle}
        statusStyle={statusStyle}
      />
    </div>
  );
};

export default TableActionsDroite;