'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import StatusCards from "@/components/admin/controle/StatusCards";
import ActionTable from "@/components/admin/controle/ActionTable";
import ActionDetails from "@/components/admin/controle/ActionDetails"; 
import ActionEdit from "@/components/admin/controle/ActionEdit.js";
import { MdOutlineAssessment } from "react-icons/md";
import PlanList from "@/components/admin/controle/PlanList";
import { MdAddCircleOutline } from "react-icons/md";
import ActionCreate from "@/components/admin/controle/ActionCreate";


const MonitoringPage = () => {
  // 1. Initialize with an empty array
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 2. Fetch actions from the API on mount
 const fetchActions = async (planId = null) => {
  try {
    setLoading(true);
    let url = "/api/admin/actions";
    if (planId) url += `?planId=${planId}`;
    
    const res = await fetch(url);
    const data = await res.json();
    setActions(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchActions();
  }, []);

  // Handle Plan Selection
const handlePlanSelect = (id) => {
  setSelectedPlanId(id);
  fetchActions(id); // Fetch actions specific to this plan
};

  // 3. Adapt Delete logic to call the API
  const handleDelete = async (id) => {
    const actionToDelete = actions.find(a => a.id === id);
    
    // Using the text description for the prompt since 'title' isn't in your Prisma model
    if(window.confirm(`Voulez-vous vraiment supprimer l'action : "${actionToDelete.description}" ?`)) {
      try {
        const res = await fetch(`/api/admin/actions?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Update local state
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

  // 4. Handle refresh after edit (to be called by ActionEdit)
  const handleRefresh = () => {
    fetchActions();
    setEditingAction(null);
  };

  return (
    <AdminLayout activePage="Contrôle">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
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

        {/* 5. Loading State Feedback */}
        {loading ? (
          <div className="p-20 text-center animate-pulse font-bold text-slate-400 uppercase tracking-widest text-xs">
            Chargement des données de contrôle...
          </div>
        ) : (
          <>
            <StatusCards actions={actions} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                <PlanList onPlanSelect={handlePlanSelect} selectedPlanId={selectedPlanId} />
              </div>
              <div className="xl:col-span-2">
                <ActionTable 
                  actions={actions} 
                  onActionClick={setSelectedAction}
                  onEditClick={setEditingAction}
                  onDeleteClick={handleDelete}
                />
              </div>
            </div>
          </>
        )}

        <ActionDetails 
          selectedAction={selectedAction} 
          onClose={() => setSelectedAction(null)} 
        />

        <ActionEdit 
          editingAction={editingAction} 
          onClose={() => setEditingAction(null)} 
          onSuccess={handleRefresh} // We'll add this prop to your Edit component next
        />

        <ActionCreate 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
          onSuccess={() => {
            setIsCreateOpen(false);
            fetchActions(selectedPlanId); // Refresh table
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default MonitoringPage;