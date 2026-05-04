'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import StatusCards from "@/components/admin/controle/StatusCards";
import TRSComparison from "@/components/admin/controle/TRSComparison";
import ActionTable from "@/components/admin/controle/ActionTable";
import ActionDetails from "@/components/admin/controle/ActionDetails"; // Your new component
import { MdOutlineAssessment } from "react-icons/md";
import ActionEdit from "@/components/admin/controle/ActionEdit.js";

const initialActions = [
  { id: 1, title: "Calibration Capteur B2", category: "Matériel", status: "Terminé", impact: "+2.5%", priority: "Haute", date: "2026-04-28"},
  { id: 2, title: "Formation Opérateurs", category: "Main d'œuvre", status: "En Cours", impact: "En attente", priority: "Moyenne", date: "2026-05-01" },
  { id: 3, title: "Nettoyage Circuit Huile", category: "Environnement", status: "A faire", impact: "0%", priority: "Basse", date: "2026-05-10" },
  {id:4, title: "Optimisation Réglages Machine", category: "Méthodes", status: "Terminé", impact: "+1.2%", priority: "Haute", date: "2026-04-30" },
  {id:5, title: "Maintenance Préventive", category: "Matériel", status: "En Cours", impact: "En attente", priority: "Moyenne", date: "2026-05-05" },
];

const MonitoringPage = () => {
  const [actions, setActions] = useState(initialActions);
  const [selectedAction, setSelectedAction] = useState(null);
  const [editingAction, setEditingAction] = useState(null);
  const [deleteAction, setDeleteAction] = useState(null);

 const handleDelete = (id) => {
    const actionToDelete = actions.find(a => a.id === id);
    
    if(window.confirm(`Voulez-vous vraiment supprimer l'action "${actionToDelete.title}" ?`)) {
      // Corrected logic: filter the current actions state and update it
      setActions(actions.filter(action => action.id !== id));
      
      // Safety: Close details panel if the deleted action was open
      if(selectedAction?.id === id) setSelectedAction(null);
    }
  };


  return (
    <AdminLayout activePage="Contrôle">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdOutlineAssessment className="text-blue-600" />
            CONTRÔLE & SUIVI
          </h1>
          <p className="text-slate-500 font-medium">Cliquez sur une action pour voir les détails de réalisation.</p>
        </div>

        <StatusCards actions={actions} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <TRSComparison  />
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

        {/* The Animated Details Panel */}
        <ActionDetails 
          selectedAction={selectedAction} 
          onClose={() => setSelectedAction(null)} 
        />
        <ActionEdit 
        editingAction={editingAction} 
        onClose={() => setEditingAction(null)} />
    
      </div>
      
    </AdminLayout>
  );
};

export default MonitoringPage;