import React from "react";
import { MdMenu } from "react-icons/md";

const MenuButton = ({ open, setOpen }) => {
    
  return (
    <div 
          className={`fixed top-5 z-50 cursor-pointer transition-all duration-300 ${
            !open ? 'left-[22%]' : 'left-5'
          }`} 
          onClick={() => setOpen(!open)}
          >
          {open ? (
            <MdMenu className="text-4xl text-[#0F172A]" />  
          ) : (
            <MdMenu className="text-4xl text-[#0F172A]" />  
          )}
        </div>
  )
};

export default MenuButton;
