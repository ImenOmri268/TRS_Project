'use client'
import React from "react";
import { MdCheckCircle, MdPendingActions, MdTrendingUp, MdErrorOutline } from "react-icons/md";
import { RiTodoLine } from "react-icons/ri";

const StatusCards = ({ actions = [] }) => {
  // Mapping logic to match your Prisma Enum: Statut { EN_COURS, TERMINE, EN_RETARD }
  const completed = actions.filter(a => a.statut === "TERMINE").length;
  const inProgress = actions.filter(a => a.statut === "EN_COURS").length;
  const delayed = actions.filter(a => a.statut === "EN_RETARD").length;
  const toDo = actions.filter(a => a.statut === "A_FAIRE").length;

  // This can eventually be fetched from your TRS model, 
  // but for now, we'll keep the structure clean for the UI
  

  const stats = [
    { 
      label: "Actions Complétées", 
      value: completed, 
      icon: <MdCheckCircle />, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "En Cours", 
      value: inProgress, 
      icon: <MdPendingActions />, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Actions a faire", 
      value: toDo, 
      icon: <RiTodoLine />, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      label: "Actions en Retard", 
      value: delayed, 
      icon: <MdErrorOutline />, 
      color: "text-rose-600", 
      bg: "bg-rose-50" 
    }
    
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-md hover:border-slate-200">
          <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl text-2xl`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mb-0.5">
              {stat.label}
            </p>
            <p className="text-2xl font-black text-slate-800 tabular-nums">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCards;