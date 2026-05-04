'use client'
import React from "react";
import { FiDownload, FiFileText } from "react-icons/fi";

const RapportGen = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-4xl shadow-sm">
        <FiFileText />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Traitement Terminé</h2>
        <p className="text-slate-500 max-w-md mx-auto mt-2">
          Toutes les étapes ont été complétées avec succès. Vous pouvez maintenant générer le rapport final en PDF.
        </p>
      </div>
      
      <div className="w-full max-w-sm bg-slate-50 border border-slate-100 p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold">Résumé du traitement</span>
          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase">Prêt</span>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
          <FiDownload /> Télécharger le Rapport .PDF
        </button>
      </div>
    </div>
  );
};

export default RapportGen;