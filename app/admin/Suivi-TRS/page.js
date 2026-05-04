import React from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import TRSStatsHeader from "@/components/admin/suivi-trs/TRSStatsHeader";
import TRSComparisonTable from "@/components/admin/suivi-trs/TRSComparisonTable";

const page = () => {
  return (
    <AdminLayout activePage="Suivi-TRS">
      <div className="flex flex-col gap-8">
        
        <TRSStatsHeader />

        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <TRSComparisonTable />
        </div>
      </div>
    </AdminLayout>
  );
};

export default page;