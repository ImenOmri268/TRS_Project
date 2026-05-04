'use client'
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import {  MdTrendingUp, MdCalendarToday } from "react-icons/md";

const GoalList = ({ goals, onGoalClick, onEditClick, onDeleteClick }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <div 
          key={goal.id}
          className="bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group relative"
          onClick={() => onGoalClick(goal)}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
              goal.status === "Atteint" ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"
            }`}>
              {goal.status}
            </span>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => { e.stopPropagation(); onEditClick(goal); }}
                className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors"
              >
                <FaRegEdit size={18} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteClick(goal.id); }}
                className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
              >
                <FaRegTrashAlt size={18} />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-2">{goal.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
            {goal.description}
          </p>

          <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
            <div className="flex items-center gap-2">
              <MdTrendingUp className="text-blue-500" />
              <span className="text-sm font-black text-slate-700">{goal.target}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MdCalendarToday size={14} />
              <span className="text-[11px] font-bold">{goal.deadline}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalList;