'use client'
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { HiPlus } from "react-icons/hi";
import { IoReturnUpBack } from "react-icons/io5";
import { MdClose, MdPersonOutline, MdMailOutline, MdToggleOn } from "react-icons/md";

const ModifUtilisateur = ({ userData, setSelectedUser }) => {
  const isOpen = !!userData;

  // Logic for the permissions list
  const permissionsList = [
    "Dashbaord",
    "les objectifs",
    "gestion des utilisateurs",
    "gestion des ressources",
    "suivi de trs",
    "traitements",
    "Plan d'actions",
    "Controle"
  ];

  return (
        <AnimatePresence mode="wait">
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={setSelectedUser}  
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
              >
                <div 
                  onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside form
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
                >
                  
                  {/* Header */}
                  <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
                    <h2 className="text-xl font-bold ">Modifier : {userData.name}</h2>
                    <button onClick={setSelectedUser} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <MdClose className="text-2xl text-slate-400" />
                    </button>
                  </div>

                  {/* Form Content */}
                  <div className="p-8 space-y-8">
                    
                    <section>
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-left">Informations à modifier</h3>
                      <div className="grid gap-4">
                    
                        <ModalInput 
                          icon={MdPersonOutline} 
                          label="Nom et Prénom" 
                          placeholder={userData.name} 
                        />
                        <ModalInput 
                          icon={MdMailOutline} 
                          label="Email" 
                          placeholder={userData.email} 
                          type="email" 
                        />
                        
                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:border-[#3B82F6] transition-all">
                          <MdToggleOn className="text-2xl text-slate-400" />
                          <div className="flex-1 text-left">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status de l&apos;utilisateur</label>
                            <select 
                              className="w-full bg-transparent text-slate-900 font-medium focus:outline-none cursor-pointer"
                              defaultValue={userData.status.toLowerCase()}
                            >
                              <option value="actif">Actif</option>
                              <option value="inactif">Inactif</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div>
                      <h3 className="text-sm text-left font-bold text-slate-400 uppercase tracking-widest mb-4">Droits d&apos;accès attribués</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {permissionsList.map((perm) => (
                          <label key={perm} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-2 rounded-lg ">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 accent-[#3B82F6] border-slate-300 rounded" 
                              // Automatically check if user already has this permission
                              defaultChecked={userData.permissions?.includes(perm)}
                            />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                    <button onClick={setSelectedUser} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                      <IoReturnUpBack /> Annuler
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all active:scale-95">
                      <HiPlus /> Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      );
    };

// Reusable Input Component to keep the UI professional
const ModalInput = ({ icon: Icon, label, ...props }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
    <Icon className="text-2xl text-slate-400" />
    <div className="flex-1 text-left">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" 
        {...props} 
      />
    </div>
  </div>
);

export default ModifUtilisateur;