import React from "react";
import { FaBell } from "react-icons/fa";

const NotifButton = ({ showNotif, setShowNotif }) => {
    
  return (
    <div className=" fixed  cursor-pointer right-5" 
        onClick={() => setShowNotif(!showNotif)}>
          {showNotif ? (
            <FaBell className="w-6 h-6 top-5 z-50 cursor-pointer text-[#3B82F6]"/> 
            ):(
            <FaBell className="w-6 h-6 top-5 z-50 cursor-pointer"/>
            )}
      </div>
  )
};

export default NotifButton;
