import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddRessourceAction from "@/components/admin/ressources/AddRessourceAction";
import TableRessources from "@/components/admin/ressources/TableRessources";

export default function Page() {
  return (
    <AdminLayout activePage="Gestion des Ressources">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          {/* Handles the state for the 'Ajouter' modal */}
          <AddRessourceAction /> 
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <TableRessources />
        </div>
      </div>
    </AdminLayout>
  );
}