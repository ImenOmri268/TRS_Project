import React from "react";
import { HiPlus } from "react-icons/hi";

const AjoutButton = ({ setIsOpen, title }) => {
  return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl transition-all hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 shadow-xl shadow-slate-200"
    >
      <HiPlus className="text-xl" />
      <span className="font-bold text-sm">{title}</span>
    </button>
  );
};

export default AjoutButton;