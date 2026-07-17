'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import GoalList from "@/components/admin/objectifs/GoalList";
import GoalDetails from "@/components/admin/objectifs/GoalDetails";
import GoalEdit from "@/components/admin/objectifs/GoalEdit";
import { MdOutlineTrackChanges } from "react-icons/md";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import AjoutGoalForm from "@/components/admin/objectifs/AjoutGoalForm";
import { Toaster } from "react-hot-toast";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/objectifs');
      const data = await res.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm(`Voulez-vous vraiment supprimer cet objectif ?`)) {
      try {
        const res = await fetch(`/api/admin/objectifs?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchGoals();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  return (
    <AdminLayout activePage="Les Objectifs">
      <Toaster position="top-center"  />
      <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlineTrackChanges className="text-blue-600" />
              GESTION DES OBJECTIFS
            </h1>
            <p className="text-slate-500 font-medium">Fixez les valeurs cibles de TRS pour chaque ressource.</p>
          </div>
          
          <AjoutButton setIsOpen={setIsOpen} title={'Nouveau Objectif'} />
        </div>

        {/* Dynamic Goal List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : goals.length === 0 ? (
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

        {/* Modals */}
        <AjoutGoalForm isOpen={isOpen} onClose={() => setIsOpen(false)} refresh={fetchGoals} />
        <GoalDetails selectedGoal={selectedGoal} onClose={() => setSelectedGoal(null)} />
        <GoalEdit editingGoal={editingGoal} onClose={() => setEditingGoal(null)} refresh={fetchGoals} />
      </div>
    </AdminLayout>
  );
};

export default GoalsPage;