import React from "react";
import { FiTrendingUp, FiTarget, FiActivity } from "react-icons/fi";

const UserTRSStatsHeader = ({ stats, loading }) => {
  const trsMoyen = loading ? "--" : `${stats?.trsMoyen || 0}%`;
  const activeMachines = loading ? "--" : stats?.nbActiveMachines || 0;
  const totalMachines = loading ? "" : ` sur ${stats?.nbMachines || 0} machines`;
  const actionsRetard = loading ? "--" : stats?.actionsEnRetard || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="Votre TRS Moyen" 
        value={trsMoyen} 
        subtext="Moyenne globale des équipements" 
        icon={<FiActivity />} 
        color="slate"
      />
      <StatCard 
        title="Équipements en Ligne" 
        value={activeMachines} 
        subtext={`Actives${totalMachines}`} 
        icon={<FiTrendingUp />} 
        color="blue"
      />
      <StatCard 
        title="Vos Actions Prioritaires" 
        value={actionsRetard} 
        subtext="Tâches nécessitant une intervention" 
        icon={<FiTarget />} 
        color="red"
      />
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-600 text-white",
    red: "bg-red-500 text-white",
    slate: "bg-white text-slate-900 border border-slate-200"
  };

  return (
    <div className={`p-6 rounded-3xl shadow-xs ${colorMap[color]} transition-all`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color === 'slate' ? 'bg-slate-100 text-slate-600' : 'bg-white/20 text-white'}`}>
          {icon}
        </div>
        <span className="text-3xl font-black font-mono">{value}</span>
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wider opacity-90">{title}</p>
        <p className="text-[11px] mt-0.5 opacity-70 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

export default UserTRSStatsHeader;