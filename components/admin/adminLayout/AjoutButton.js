import Image from "next/image";
import React from "react";
import { HiPlus } from "react-icons/hi";


const AjoutButton = ({  setIsOpen ,title }) => {
  return (
    <button 
      onClick={() => setIsOpen(true)} 
      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-lg transition-all  active:scale-95"
    >
      <HiPlus className="text-xl" />
      <span className="font-semibold text-sm">{title}</span>
    </button>
  );
};

export default AjoutButton;