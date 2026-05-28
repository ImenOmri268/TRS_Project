'use client'
import UserLayout from "@/components/user/userLayout/UserLayout";
import TableUtilisateur from "@/components/user/utilisateurs/TableUtilisateur";
import AjoutButton from "@/components/admin/adminLayout/AjoutButton";
import AjoutUserForm from "@/components/user/utilisateurs/AjoutUserForm";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import { usePermissions } from "@/app/lib/hooks/usePermissions";

export default function Page() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { can } = usePermissions();

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/utilisateurs');
      if (!res.ok) throw new Error('Erreur lors du chargement');
      const data = await res.json();
      setUtilisateurs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUtilisateurs(); }, []);

  return (
    <UserLayout activePage="Liste des utilisateurs">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlinePeopleAlt className="text-blue-600" size={32} />
              GESTION DES UTILISATEURS
            </h1>
            <p className="text-slate-500 text-sm ml-11">
              Gérez les accès et les permissions de vos utilisateurs
            </p>
          </div>
          {can('ajouter_utilisateur') && (
            <AjoutButton setIsOpen={setIsOpen} title="Ajouter un utilisateur" />
          )}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <div className="animate-pulse text-slate-400">Chargement...</div>
            </div>
          ) : utilisateurs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 font-medium">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <TableUtilisateur
              utilisateurs={utilisateurs}
              refresh={fetchUtilisateurs}
              canModifier={can('modifier_utilisateur')}
              canSupprimer={can('supprimer_utilisateur')}
            />
          )}
        </div>

        {can('ajouter_utilisateur') && (
          <AjoutUserForm
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            refresh={fetchUtilisateurs}
            userToEdit={null}
            apiUrl="/api/user/utilisateurs"
          />
        )}
      </div>
    </UserLayout>
  );
}