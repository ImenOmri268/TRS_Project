'use client'
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { MdClose } from "react-icons/md";


const NotifBar = ({showNotif ,setShowNotif}) => {
  return (
    <AnimatePresence mode="wait">
      {showNotif && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{opacity:0,y:-100}}
          className="absolute top-12 right-5 md:right-5 lg:right-4 w-75 h-125 bg-[#fefefe] shadow-2xl z-[100px] rounded-xl overflow-hidden "
        >
          <div>
                <div className="flex gap-35 p-5 ">  
                    <span className="font-semi text-lg">Notifications</span>
                    <MdClose className="cursor-pointer text-2xl " onClick={() => setShowNotif(!showNotif)}/>
                </div>
                <hr className="text-gray-300"/>
                <div className="flex flex-col justify-center gap-4 p-5">
                    <span className="text-[#3B82F6]  ">RECENT</span>
                </div>
                <footer className="py-[95%] px-7">
                    <span className=" text-[#cd0000] font-medium hover:text-[#f35353] cursor-pointer ">
                        SUPPRIMER LES NOTIFICATIONS
                    </span>
                </footer>
          </div>      

                    
                
                    
                
            </motion.div>



        )
        }
    </AnimatePresence>
  )
};

export default NotifBar;
