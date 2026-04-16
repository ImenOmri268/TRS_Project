import React from "react";
import Title from "@/components/adminLayout/Title";
import AdminLayout from "@/components/adminLayout/AdminLayout";
import AjoutButton from "@/components/adminLayout/utilisateurs/AjoutButton";
import TableUtilisateur from "@/components/adminLayout/utilisateurs/TableUtilisateur";



const page =  () => {

  
  return (
    <AdminLayout activePage="Liste des utilisateurs">
      <AjoutButton />
      <TableUtilisateur/>
    </AdminLayout>
   
  )
};
export default page;
