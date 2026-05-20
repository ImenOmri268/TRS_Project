'use client'
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import GoalList from "@/components/user/objectifs/GoalList";
import GoalDetails from "@/components/admin/objectifs/GoalDetails";
import GoalEdit from "@/components/admin/objectifs/GoalEdit";
import AjoutGoalForm from "@/components/admin/objectifs/AjoutGoalForm";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import { MdOutlineTrackChanges } from "react-icons/md";
import { usePermissions } from "@/app/lib/hooks/usePermissions";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const { can } = usePermissions();

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/objectifs');
      const data = await res.json();
      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

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
    <UserLayout activePage="Objectifs">
      <div className="p-8 space-y-8 animate-in fade-in duration-700 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlineTrackChanges className="text-blue-600" />
              GESTION DES OBJECTIFS
            </h1>
            <p className="text-slate-500 font-medium">Définissez et suivez vos indicateurs de performance clés.</p>
          </div>

          {can('ajouter_objectif') && (
            <AjoutButton setIsOpen={setIsOpen} title={'Nouvel Objectif'} />
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-bold text-slate-800">Aucun objectif défini</h3>
          </div>
        ) : (
          <GoalList 
            goals={goals} 
            onGoalClick={setSelectedGoal} 
            onEditClick={setEditingGoal} 
            onDeleteClick={handleDelete}
            canModifier={can('modifier_objectif')}
            canSupprimer={can('supprimer_objectif')}
          />
        )}

        {can('ajouter_objectif') && (
          <AjoutGoalForm isOpen={isOpen} onClose={() => setIsOpen(false)} refresh={fetchGoals} ressourcesApiUrl="/api/user/ressources"/>
        )}
        <GoalDetails selectedGoal={selectedGoal} onClose={() => setSelectedGoal(null)} />
        {can('modifier_objectif') && (
          <GoalEdit editingGoal={editingGoal} onClose={() => setEditingGoal(null)} refresh={fetchGoals} />
        )}
      </div>
    </UserLayout>
  );
};

export default GoalsPage;