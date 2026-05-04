import React from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import ManualActions from "@/components/admin/actions/ManualActions";
import AiActions from "@/components/admin/actions/AiActions";
import { MdTimeline } from "react-icons/md";

const Page = () => {
  return (
    <AdminLayout activePage="Plan d'actions">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <MdTimeline className="text-blue-600" />
            AMÉLIORATION CONTINUE
          </h1>
          <p className="text-slate-500 font-medium">Transformez vos analyses en résultats concrets.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
          <ManualActions />
          <AiActions />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;