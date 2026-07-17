import React from "react";
import { FiTrendingUp, FiTarget, FiActivity } from "react-icons/fi";

const TRSStatsHeader = ({ stats, loading }) => {
  const trsMoyen = loading ? "--" : `${stats?.trsMoyen || 0}%`;
  
  // Use nbActiveMachines from the API
  const activeMachines = loading ? "--" : stats?.nbActiveMachines || 0;
  const totalMachines = loading ? "" : ` sur ${stats?.nbMachines || 0} au total`;
  
  const actionsRetard = loading ? "--" : stats?.actionsEnRetard || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="TRS Moyen Global" 
        value={trsMoyen} 
        subtext="Moyenne de toutes les ressources" 
        icon={<FiActivity />} 
        color="slate"
      />
      <StatCard 
        title="Ressources Actives" 
        value={activeMachines} 
        subtext={`Machines actuellement en ligne${totalMachines}`} 
        icon={<FiTrendingUp />} 
        color="blue"
      />
      <StatCard 
        title="Actions en Retard" 
        value={actionsRetard} 
        subtext="Nécessite une attention immédiate" 
        icon={<FiTarget />} 
        color="red"
      />
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-600 text-white",
    red: "bg-red-400 text-red-50",
    slate: "bg-white text-slate-900 border border-slate-200"
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm ${colorMap[color]} transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color === 'slate' ? 'bg-slate-100 text-slate-600' : 'bg-white/20 text-white'}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider opacity-80">{title}</p>
        <p className="text-xs mt-1 opacity-70">{subtext}</p>
      </div>
    </div>
  );
};

export default TRSStatsHeader;