'use client';
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import UserTRSStatsHeader from "@/components/user/suivi-trs/UserTRSStatsHeader";
import UserTRSComparisonTable from "@/components/user/suivi-trs/UserTRSComparisonTable";

const UserSuiviTRSPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/suivi-trs');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("User Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserLayout activePage="Suivi-TRS">
      <div className="flex flex-col gap-8 animate-in fade-in duration-300">
        {/* En-tête statistique dédié à l'espace utilisateur */}
        <UserTRSStatsHeader stats={data?.stats} loading={loading} />

        {/* Tableau de bord opérationnel */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
          <UserTRSComparisonTable machines={data?.machines || []} loading={loading} />
        </div>
      </div>
    </UserLayout>
  );
};

export default UserSuiviTRSPage;