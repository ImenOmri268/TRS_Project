'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdPersonOutline, MdMailOutline, MdLockOutline, MdBusinessCenter } from "react-icons/md";
import { HiPlus } from "react-icons/hi";  
import { IoReturnUpBack } from "react-icons/io5";

const AjoutUserForm = ({ isOpen, onClose }) => {
  const permissions = ["Collecte de données", "Suivi des données", "Consultation TRS", "Analyse des causes"];


  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* blur background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />

          {/* form slide-in */}
          <motion.div
            initial={{ opacity: 0, x: 100 }} // Sliding in like the menu
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 "
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
              <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
                <h2 className="text-xl font-bold ">Ajouter un utilisateur</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Informations</h3>
                  <div className="grid gap-4">
                    <ModalInput icon={MdPersonOutline} label="Nom" placeholder="Prénom Nom" />
                    <ModalInput icon={MdMailOutline} label="Email" placeholder="email@exemple.com" />
                    <ModalInput icon={MdBusinessCenter} label="Rôle" placeholder="Technicien"  />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Droits d&apos;accès</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissions.map((perm) => (
                      <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 accent-[#3B82F6] border-slate-300 rounded" />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button onClick={onClose} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                  <HiPlus /> Ajouter
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ModalInput = ({ icon: Icon, label, placeholder }) => (
  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 group focus-within:border-[#3B82F6] transition-all">
    <Icon className="text-2xl text-slate-400" />
    <div className="flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase  tracking-widest">{label}</label>
      <input className="w-full bg-transparent text-slate-900 font-medium focus:outline-none placeholder:text-slate-300" placeholder={placeholder} />
    </div>
  </div>
);

export default AjoutUserForm;