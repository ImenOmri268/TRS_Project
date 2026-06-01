'use client'
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdClose, MdSecurity, MdHistory, MdCheckCircle, MdInfoOutline } from "react-icons/md";

const DetailsUtilisateur = ({ userData, onClose, isOpen }) => {
  if (!userData) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 h-full w-full bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl shadow-2xl h-full w-full max-w-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <MdInfoOutline size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
                  <p className="text-xs text-slate-500 italic">{userData.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose className="text-2xl text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Basic Information Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MdHistory className="text-blue-500 text-lg" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    État du compte
                  </h3>
                </div>
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <InfoRow label="Identifiant" value={`#${userData.id.toString().padStart(3, '0')}`} />
                  <InfoRow label="Statut Actuel" value={userData.displayStatus} isBadge />
                  <InfoRow label="Role" value={userData.userRole} />

                </div>
              </section>
              
              {/* Permissions List Section */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <MdSecurity className="text-blue-500 text-lg" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Droits d&apos;accès activés
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {/* Using permissionNames from our updated API */}
                  {userData.permissionNames && userData.permissionNames.length > 0 ? (
                    userData.permissionNames.map((permName, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <MdCheckCircle className="text-emerald-500" />
                        <span className="text-sm font-semibold text-slate-700">{permName}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-sm text-amber-600 italic">Aucune permission spécifique attribuée à ce collaborateur.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-600 leading-relaxed italic">
                  Note: Ces permissions permettent à {userData.name }&nbsp; d&apos;accéder aux modules spécifiques de l&apos;application. Toute modification doit être effectuée par l&apos;administrateur.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button 
                onClick={onClose} 
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <IoReturnUpBack /> Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoRow = ({ label, value, isBadge }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    {isBadge ? (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
        value === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
      }`}>
        {value}
      </span>
    ) : (
      <span className="text-sm font-bold text-slate-800">{value}</span>
    )}
  </div>
);

export default DetailsUtilisateur;