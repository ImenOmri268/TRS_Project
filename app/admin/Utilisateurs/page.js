'use client'
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddUserAction from "@/components/admin/utilisateurs/AddUserAction";
import TableUtilisateur from "@/components/admin/utilisateurs/TableUtilisateur";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function Page() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      // Ensure this matches the path of the API file we just updated
      const res = await fetch('/api/admin/utilisateurs'); 
      
      if (!res.ok) throw new Error('Erreur lors du chargement des données');
      
      const data = await res.json();
      
      // We map the data but keep the objects intact for the Edit/Details modals
      const mappedData = data.map(user => ({
        ...user,
        // We keep the boolean status or numeric value for logic, 
        // but can add a display string if needed.
        displayStatus: user.status ? 'Actif' : 'Inactif'
      }));
      
      setUtilisateurs(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  if (loading) {
    return (
      <AdminLayout activePage="Liste des utilisateurs">
        <div className="p-8 flex items-center justify-center min-h-100">
          <div className="animate-pulse text-slate-400 font-medium">Chargement des utilisateurs...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout activePage="Liste des utilisateurs">
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="Liste des utilisateurs">
        <Toaster position="top-center"  />
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
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
          
          {/* AddUserAction handles the "Nouveau Utilisateur" button and modal */}
          <AddUserAction refresh={fetchUtilisateurs} /> 
        </div>
        
        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          {utilisateurs.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                <MdOutlinePeopleAlt size={30} />
              </div>
              <p className="text-slate-500 font-medium">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <TableUtilisateur
              utilisateurs={utilisateurs}
              refresh={fetchUtilisateurs}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}