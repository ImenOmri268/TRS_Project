import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddUserAction from "@/components/admin/utilisateurs/AddUserAction";
import TableUtilisateur from "@/components/admin/utilisateurs/TableUtilisateur";

export default function Page() {
  return (
    <AdminLayout activePage="Liste des utilisateurs">
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          {/* This component handles the add user form  */}
          <AddUserAction /> 
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <TableUtilisateur/>
        </div>
      </div>
    </AdminLayout>
  );
}