'use client'
import React from "react";
import { MdCheckCircle, MdPendingActions, MdTrendingUp } from "react-icons/md";

const StatusCards = ({ actions }) => {
  const completed = actions.filter(a => a.status === "Terminé").length;
  const inProgress = actions.filter(a => a.status === "En Cours").length;
    const AdminTrs={
        initial: 68,
        current: 71.7,
        gain: 5.4
    };
  const stats = [
    { label: "Actions Complétées", value: completed, icon: <MdCheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "En Cours d'Exécution", value: inProgress, icon: <MdPendingActions />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Amélioration TRS Estimée", value: `${AdminTrs.gain}%`, icon: <MdTrendingUp />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl text-2xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;