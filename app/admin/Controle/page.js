'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import StatusCards from "@/components/admin/controle/StatusCards";
import ActionTable from "@/components/admin/controle/ActionTable";
import ActionDetails from "@/components/admin/controle/ActionDetails"; 
import ActionEdit from "@/components/admin/controle/ActionEdit.js";
import { MdOutlineAssessment, MdOutlineToc } from "react-icons/md";
import PlanList from "@/components/admin/controle/PlanList";
import { MdAddCircleOutline } from "react-icons/md";
import ActionCreate from "@/components/admin/controle/ActionCreate";

const MonitoringPage = () => {
  const [actions, setActions] = useState([]);
  // FIXED: Initialize loading as false because no fetch runs on mount anymore
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch actions from the API filtered by Action Plan
  const fetchActions = async (planId = null) => {
    if (!planId) {
      setActions([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/actions?planId=${planId}`);
      const data = await res.json();
      setActions(data || []);
    } catch (err) {
      console.error("Error fetching filtered action targets:", err);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  // REMOVED: The initial empty useEffect component mount fetch execution 
  // Actions are now exclusively loaded via handlePlanSelect events

  // Handle Plan Selection
  const handlePlanSelect = (id) => {
    setSelectedPlanId(id);
    fetchActions(id); 
  };

  const handleDelete = async (id) => {
    const actionToDelete = actions.find(a => a.id === id);
    
    if(window.confirm(`Voulez-vous vraiment supprimer l'action : "${actionToDelete?.description}" ?`)) {
      try {
        const res = await fetch(`/api/admin/actions?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setActions(prev => prev.filter(action => action.id !== id));
          if(selectedAction?.id === id) setSelectedAction(null);
        } else {
          alert("Erreur lors de la suppression sur le serveur.");
        }
      } catch (err) {
        console.error("Erreur delete:", err);
      }
    }
  };

  const handleRefresh = () => {
    fetchActions(selectedPlanId); // FIXED: Keep filter context upon editing refresh loops
    setEditingAction(null);
  };

  return (
    <AdminLayout activePage="Contrôle">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlineAssessment className="text-blue-600" />
              CONTRÔLE & SUIVI
            </h1>
            <p className="text-slate-500 font-medium italic">
              Surveillance en temps réel des performances et des correctifs.
            </p>
          </div>
          <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:shadow-lg active:scale-95"
          >
              <MdAddCircleOutline size={20} />
              Ajouter une action
          </button>
        </div>
        
        <ActionCreate 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
          onSuccess={() => {
            setIsCreateOpen(false);
            fetchActions(selectedPlanId); 
          }}
        />

        {/* Global Action Status Metrics Widgets */}
        <StatusCards actions={actions} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT SIDE: PLAN COMPONENT SELECTION BAR */}
          <div className="xl:col-span-1">
            <PlanList onPlanSelect={handlePlanSelect} selectedPlanId={selectedPlanId} />
          </div>

          {/* RIGHT SIDE: CONDITIONALLY LOADED DATA ACTIONS DATA PANEL */}
          <div className="xl:col-span-2">
            {loading ? (
              <div className="bg-white rounded-[2rem] border border-slate-200/60 p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs min-h-[40vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Chargement des actions associées...</span>
                </div>
              </div>
            ) : !selectedPlanId ? (
              // FIXED: User instruction layout wrapper displayed when no Plan is targeted yet
              <div className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center min-h-[44vh] flex flex-col items-center justify-center text-slate-400">
                <MdOutlineToc size={48} className="mb-3 opacity-20 text-slate-500" />
                <h3 className="font-bold text-sm text-slate-700">Aucun plan d&apos;actions sélectionné</h3>
                <p className="text-xs max-w-sm mt-1 text-slate-400">
                  Veuillez cliquer sur l&apos;un des plans de traitement dans la liste de gauche pour afficher et manager ses actions correctives.
                </p>
              </div>
            ) : (
              <ActionTable 
                actions={actions} 
                onActionClick={setSelectedAction}
                onEditClick={setEditingAction}
                onDeleteClick={handleDelete}
              />
            )}
          </div>
        </div>

        <ActionEdit 
          editingAction={editingAction} 
          onClose={() => setEditingAction(null)} 
          onSuccess={handleRefresh} 
        />

        <ActionDetails 
          selectedAction={selectedAction} 
          onClose={() => setSelectedAction(null)} 
        />
        
      </div>
    </AdminLayout>
  );
};

export default MonitoringPage;