
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddUserAction from "@/components/admin/utilisateurs/AddUserAction";
import TableUtilisateur from "@/components/admin/utilisateurs/TableUtilisateur";
import { MdOutlinePeopleAlt } from "react-icons/md";

export default function Page() {
    const utilisateurs = [
    { id: 1, name: "John Doe", status: "Actif", email: "john@example.com", permissions: ["Dashbaord","les objectifs","gestion des utilisateurs"], actions:["consulter dashboard","ajouter un utilisateur"] }, 
    { id: 2, name: "Jane Smith", status: "Inactif", email: "jane@example.com", permissions: ["Plan d'actions", "Controle"] ,actions:["consulter plan d'actions","ajouter un plan d'action"]},
    { id: 3, name: "Alice Johnson", status: "Actif", email: "alice@example.com", permissions: ["suivi de trs", "traitements"] ,actions:["consulter suivi de trs","ajouter un traitement"]},
  ];

  return (
    <AdminLayout activePage="Liste des utilisateurs">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <MdOutlinePeopleAlt className="text-blue-600" />
              GESTION DES UTILISATEURS
            </h1>
            <p className="text-slate-500 font-medium">Gérez les accès et les permissions de votre équipe technique.</p>
          </div>
          <AddUserAction /> 
        </div>
        
        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <TableUtilisateur
            utilisateurs={utilisateurs}  
          />
        </div>
      </div>
    </AdminLayout>
  );
}