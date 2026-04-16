import React from "react";

import AdminLayout from "@/components/adminLayout/AdminLayout";



const page =  () => {

  
  return (
    <AdminLayout activePage="Dashboard">
      <div className="py-5">
        <span className="font-semibold text-2xl text-[#312D2D] ">Performances TRS par ligne</span>
      </div>

      <div>
        machine
      </div>

      <div className="py-5">
        <span className="font-semibold text-2xl text-[#312D2D] ">Résultats d&apos;amélioration du TRS</span>
      </div>
      <div>
        presentation graphique
      </div>

    </AdminLayout>
   
  )
};
export default page;
