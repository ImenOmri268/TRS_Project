'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import GoalList from "@/components/admin/objectifs/GoalList";
import GoalDetails from "@/components/admin/objectifs/GoalDetails";
import GoalEdit from "@/components/admin/objectifs/GoalEdit";
import { MdOutlineTrackChanges, MdAdd } from "react-icons/md";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import AjoutGoalForm from "@/components/admin/objectifs/AjoutGoalForm";

const initialGoals = [/*
  { id: 1, title: "Optimisation TRS Ligne A", target: "85%", deadline: "2026-06-30", status: "En Cours", description: "Atteindre un TRS de 85% sur la ligne principale en réduisant les micro-arrêts." },
  { id: 2, title: "Réduction Temps de Réglage", target: "-15 min", deadline: "2026-05-15", status: "Atteint", description: "Diminuer le temps moyen de changement de série via la méthode SMED." },
  { id: 3, title: "Zéro Défaut Qualité", target: "100%", deadline: "2026-12-01", status: "Non Commencé", description: "Éliminer les rebuts liés aux erreurs de paramétrage du capteur B2." },
*/];

const GoalsPage = () => {
  const [goals, setGoals] = useState(initialGoals);
  const [isOpen , setIsOpen]=useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleDelete = (id) => {
    const goal = goals.find(g => g.id === id);
    if(window.confirm(`Voulez-vous vraiment supprimer ${goal.title} ?`)) {
      setGoals(goals.filter(goal => goal.id !== id));
    }
  };

  return (
    <AdminLayout activePage="Les Objectifs">
      <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlineTrackChanges className="text-blue-600" />
              GESTION DES OBJECTIFS
            </h1>
            <p className="text-slate-500 font-medium">Définissez et suivez vos indicateurs de performance clés.</p>
          </div>
          
          <AjoutButton setIsOpen={setIsOpen} title={'Nouvel Objectif'} />
        </div>

        {/* Dynamic Goal List */}
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdOutlineTrackChanges className="text-slate-400 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Aucun objectif défini</h3>
            <p className="text-slate-500 mt-2">Commencez par créer votre premier objectif.</p>
          </div>
        ) : (
          <GoalList 
            goals={goals} 
            onGoalClick={setSelectedGoal} 
            onEditClick={setEditingGoal} 
            onDeleteClick={handleDelete}
          />
        )}


        {/* Modals & Overlays */}
        <AjoutGoalForm isOpen={isOpen} onClose={() => setIsOpen(null)} />
        <GoalDetails selectedGoal={selectedGoal} onClose={() => setSelectedGoal(null)} />
        <GoalEdit editingGoal={editingGoal} onClose={() => setEditingGoal(null)} />
      </div>
    </AdminLayout>
  );
};

export default GoalsPage;