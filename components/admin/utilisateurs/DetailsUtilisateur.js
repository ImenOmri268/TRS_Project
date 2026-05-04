'use client'
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { MdClose, MdSecurity, MdHistory, MdCheckCircle, MdInfoOutline } from "react-icons/md";

const DetailsUtilisateur = ({ userData, setSelectedUserDetails }) => {
  const isOpen = !!userData;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={setSelectedUserDetails}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
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
                <button onClick={setSelectedUserDetails} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
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
                      État & Actions de l&apos;information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="Identifiant" value={`#${userData.id.toString().padStart(3, '0')}`} />
                    <InfoRow label="Statut du Compte" value={userData.status} isBadge />
                    
                  </div>
                </section>
                
                {/* 1. Permissions List Section */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MdSecurity className="text-blue-500 text-lg" />
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Permissions & Droits d&apos;accès
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {userData.permissions && userData.permissions.length > 0 ? (
                      userData.permissions.map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <MdCheckCircle className="text-green-500" />
                          <span className="text-sm font-medium text-slate-700">{perm}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic ml-2 text-left">Aucune permission spécifique attribuée.</p>
                    )}
                  </div>
                </section>

                {/* 2. List of Information Actions */}
                
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MdSecurity className="text-blue-500 text-lg" />
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Les actions attribuées a {userData.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {userData.actions && userData.actions.length > 0 ? (
                      userData.actions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <MdCheckCircle className="text-blue-500" />
                          <span className="text-sm font-medium text-slate-700">{action}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic ml-2 text-left">Aucune action spécifique attribuée.</p>
                    )}
                  </div>
                </section>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button 
                  onClick={setSelectedUserDetails} 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <IoReturnUpBack /> Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper component for rows in the "Actions/Information" section
const InfoRow = ({ label, value, isBadge }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50">
    <span className="text-sm text-slate-500">{label}</span>
    {isBadge ? (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
        value === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {value}
      </span>
    ) : (
      <span className="text-sm font-bold text-slate-800">{value}</span>
    )}
  </div>
);

export default DetailsUtilisateur;