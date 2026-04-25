import React from "react";

import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import StatsTRS from "@/components/admin/dashboard/StatsTRS";
import PinnedMachine from "@/components/admin/dashboard/PinnedMachine";
import PinnedActions from "@/components/admin/dashboard/PinnedActions";



const page =  () => {

  
  return (
    <AdminLayout activePage="Dashboard">
      
      <StatsTRS />
      <PinnedMachine />

      <PinnedActions/>
      

    </AdminLayout>
   
  )
};
export default page;
