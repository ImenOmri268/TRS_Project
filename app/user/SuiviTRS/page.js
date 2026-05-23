'use client'
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import TRSStatsHeader from "@/components/admin/suivi-trs/TRSStatsHeader";
import TRSComparisonTable from "@/components/admin/suivi-trs/TRSComparisonTable";

const Page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/dashboard')
      .then(res => res.json())
      .then(result => { setData(result); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <UserLayout activePage="Suivi TRS">
      <div className="flex flex-col gap-8">
        <TRSStatsHeader stats={data?.stats} loading={loading} />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <TRSComparisonTable machines={data?.machines || []} loading={loading} />
        </div>
      </div>
    </UserLayout>
  );
};

export default Page;