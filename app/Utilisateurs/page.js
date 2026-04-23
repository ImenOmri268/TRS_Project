import AdminLayout from "@/components/adminLayout/AdminLayout";
import AjoutButton from "@/components/adminLayout/utilisateurs/AjoutButton";
import TableUtilisateur from "@/components/adminLayout/utilisateurs/TableUtilisateur";




const page =  () => {

  
  return (
    
    <AdminLayout activePage="Liste des utilisateurs"  >
      <div className=" px-[55%] md:px-[80%] lg:px-[80%]">
        <AjoutButton />
      </div>
      
      <TableUtilisateur/>
    </AdminLayout>
    
   
   
  )
};
export default page;
