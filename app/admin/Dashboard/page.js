import React from "react";

import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import StatsTRS from "@/components/admin/dashboard/StatsTRS";




const page =  () => {

  
  return (
    <AdminLayout activePage="Dashboard">
      
      <StatsTRS />
     
    </AdminLayout>
   
  )
};
export default page;
