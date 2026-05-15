'use client'
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import TRSStatsHeader from "@/components/admin/suivi-trs/TRSStatsHeader";
import TRSComparisonTable from "@/components/admin/suivi-trs/TRSComparisonTable";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout activePage="Suivi-TRS">
      <div className="flex flex-col gap-8">
        {/* We pass the whole stats object which now contains nbActiveMachines */}
        <TRSStatsHeader stats={data?.stats} loading={loading} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <TRSComparisonTable machines={data?.machines || []} loading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;