import React from "react";
import { FiTrendingUp, FiTarget, FiActivity } from "react-icons/fi";

const exampleData = {
  initial: "75%",
  current: "82%",
  target: "90%"
};

const TRSStatsHeader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        title="TRS Initial" 
        value={exampleData.initial} 
        subtext="Au début de l'utilisation" 
        icon={<FiActivity />} 
        color="slate"
      />
      <StatCard 
        title="TRS Actuel (Final)" 
        value={exampleData.current} 
        subtext="+13% d'amélioration" 
        icon={<FiTrendingUp />} 
        color="blue"
      />
      <StatCard 
        title="Objectif Cible" 
        value={exampleData.target} 
        subtext="Distance à l'objectif: 7%" 
        icon={<FiTarget />} 
        color="green"
      />
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-500 text-white",
    slate: "bg-white text-slate-900 border border-slate-200"
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color === 'slate' ? 'bg-slate-100 text-slate-600' : 'bg-white/20 text-white'}`}>
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div>
        <p className={`text-sm font-bold uppercase tracking-wider opacity-80`}>{title}</p>
        <p className="text-xs mt-1 opacity-70">{subtext}</p>
      </div>
    </div>
  );
};

export default TRSStatsHeader;