'use client';
import React, { useState } from "react";
import { FiCalendar, FiCheck, FiX, FiEdit2 } from "react-icons/fi";

const TableActionsDroite = ({ actions, refresh }) => {
  // Stocke l'ID de l'action en cours de modification de statut
  const [editingActionId, setEditingActionId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenForm = (action) => {
    setEditingActionId(action.id);
    setSelectedStatus(action.statut); // Pré-sélectionner le statut actuel
  };

  const handleCancel = () => {
    setEditingActionId(null);
    setSelectedStatus("");
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
        setEditingActionId(null); // Fermer le formulaire
        refresh(); // Recharger les données globales
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
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{action.title}</span>
                        <span className="text-xs text-slate-400 line-clamp-2 mt-0.5">{action.description || 'Aucune consigne rédigée.'}</span>
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
                        onClick={() => handleOpenForm(action)}
                        className={`px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer hover:scale-105 flex items-center justify-center gap-1.5 mx-auto ${statusStyle[action.statut]}`}
                      >
                        {action.statut.replace('_', ' ')}
                        <FiEdit2 className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px]" />
                      </button>
                    </td>
                  </tr>

                  {/* FORMULAIRE CONTEXTUEL (S'affiche juste en dessous si cliqué) */}
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
    </div>
  );
};

export default TableActionsDroite;