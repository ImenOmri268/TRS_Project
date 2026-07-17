'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GoalList from "@/components/admin/objectifs/GoalList";
import GoalDetails from "@/components/admin/objectifs/GoalDetails";
import GoalEdit from "@/components/admin/objectifs/GoalEdit";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import AjoutGoalForm from "@/components/admin/objectifs/AjoutGoalForm";

const GoalsManager = ({ initialGoals }) => {
  const [isOpen , setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const router = useRouter();

  const refreshData = () => router.refresh();

  const handleDelete = async (id) => {
    if(window.confirm(`Voulez-vous vraiment supprimer cet objectif ?`)) {
      const res = await fetch(`/api/admin/objectifs?id=${id}`, { method: 'DELETE' });
      if (res.ok) refreshData();
    }
  };

  return (
    <>
      <div className="flex justify-end -mt-20 mb-8">
        <AjoutButton setIsOpen={setIsOpen} title={'Nouvel Objectif'} />
      </div>

      {initialGoals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800">Aucun objectif défini</h3>
        </div>
      ) : (
        <GoalList 
          goals={initialGoals} 
          onGoalClick={setSelectedGoal} 
          onEditClick={setEditingGoal} 
          onDeleteClick={handleDelete}
        />
      )}

      <AjoutGoalForm isOpen={isOpen} onClose={() => setIsOpen(false)} refresh={refreshData} />
      <GoalDetails selectedGoal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      <GoalEdit editingGoal={editingGoal} onClose={() => setEditingGoal(null)} refresh={refreshData} />
    </>
  );
};

export default GoalsManager;