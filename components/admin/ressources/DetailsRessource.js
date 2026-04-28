'use client'
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFunctions, MdAddChart } from "react-icons/md";
import { IoReturnUpBack } from "react-icons/io5";

const DetailsRessource = ({ open, setOpen }) => {
  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />

          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white px-8 py-6 flex items-center justify-between border-b border-slate-100 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MdFunctions size={24}/></div>
                  <h2 className="text-xl font-bold">Détails de la nouvelle collection</h2>
                </div>
                <button onClick={setOpen} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <MdClose className="text-2xl text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Current Values Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ValueCard label="Disponibilité" value="92%" color="green" />
                  <ValueCard label="Performance" value="85%" color="blue" />
                  <ValueCard label="Qualité" value="98%" color="amber" />
                </div>

                {/* Update Values Form */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MdAddChart className="text-blue-500" /> Ajouter les données de taux de disponibilité
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                       <CalcInput label="Temps total prévu de production(min)" placeholder="20" />
                       <CalcInput label="Temps d'arrêt (min)" placeholder="480" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MdAddChart className="text-blue-500" />Ajouter les données de taux de performance
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                       <CalcInput label="Qté_Produite_Total" placeholder="20" />
                       <CalcInput label="Temps_Unitaire_Théorique (min)" placeholder="480" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <CalcInput label="Temps_Opération" placeholder="1050" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MdAddChart className="text-blue-500" /> Ajouter les données de taux de qualité
                  </h3>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                       <CalcInput label="Quantité totale produite" placeholder="20" />
                       <CalcInput label="Quantité de pièces défectueuses ou rebutées" placeholder="480" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <CalcInput label="Quantité de pièces à retravailler" placeholder="1050" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
                <button onClick={setOpen} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                  <IoReturnUpBack /> Annuler
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                   Recalculer les Taux
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ValueCard = ({ label, value, color }) => {
    const colors = {
        green: "text-green-600 bg-green-50 border-green-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100"
    };
    return (
        <div className={`p-4 rounded-2xl border ${colors[color]} text-center`}>
            <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
};

const CalcInput = ({ label, placeholder }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{label}</label>
      <input 
        type="number"
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
        placeholder={placeholder}
      />
    </div>
);

export default DetailsRessource;