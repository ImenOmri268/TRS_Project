'use client'
import React, { useState } from "react";
import { MdSettingsInputComponent, MdOutlinePlaylistAddCheck, MdArrowForwardIos } from "react-icons/md";

// Note: In a real app, you'd import 'ressources' from a data file
const ressources = [
  { id: 1, name: "Presse Hydraulique A1", collection: "Machine", champs: { disponibilité: ["Temps_Prévu", "Temps d'arrêts"], performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], qualité: ["Qté_Produite_Total", "Qté_Rebut", "Qté_Réwork"] } },
  { id: 2, name: "Scie Circulaire B2", collection: "Machine", champs: { disponibilité: ["Temps_Prévu", "Temps d'arrêts"], performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], qualité: ["Qté_Produite_Total", "Qté_Rebut", "Qté_Réwork"] } },
  { id: 3, name: "Tour CNC C3", collection: "Machine", champs: { disponibilité: ["Temps_Prévu", "Temps d'arrêts"], performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], qualité: ["Qté_Produite_Total", "Qté_Rebut", "Qté_Réwork"] } }
];

const CollectData = () => {
  const [selectedResourceId, setSelectedResourceId] = useState(null);

  const selectedResource = ressources.find(r => r.id === selectedResourceId);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <MdSettingsInputComponent className="text-blue-600" /> Collecte des Données
        </h2>
        <p className="text-sm text-slate-500 mt-1">Sélectionnez une ressource pour saisir les données brutes de production.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Resource Selection List (Left Side) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ressources disponibles</h3>
          <div className="space-y-2">
            {ressources.map((res) => (
              <button
                key={res.id}
                onClick={() => setSelectedResourceId(res.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selectedResourceId === res.id 
                  ? "bg-blue-50 border-blue-200 shadow-sm" 
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="text-left">
                  <p className={`text-sm font-bold ${selectedResourceId === res.id ? "text-blue-700" : "text-slate-700"}`}>
                    {res.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase">{res.collection}</p>
                </div>
                {selectedResourceId === res.id && <MdArrowForwardIos className="text-blue-400 text-xs" />}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Form (Right Side) */}
        <div className="lg:col-span-8">
          {selectedResource ? (
            <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <MdOutlinePlaylistAddCheck className="text-blue-600 text-2xl" />
                <h3 className="text-lg font-bold text-slate-800">Saisie des données : {selectedResource.name}</h3>
              </div>

              {Object.entries(selectedResource.champs).map(([category, fields]) => (
                <div key={category} className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider border-l-2 border-blue-500 pl-3">
                    Données de {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fields.map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                          {field.replace(/_/g, ' ')}
                        </label>
                        <input 
                          type="number" 
                          placeholder="Entrez la valeur"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-75 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="p-4 bg-slate-50 rounded-full mb-4">
                <MdSettingsInputComponent size={40} className="text-slate-200" />
              </div>
              <p className="font-medium">Aucune ressource sélectionnée</p>
              <p className="text-xs max-w-50 mt-2">Veuillez choisir une ressource dans la liste de gauche pour commencer la saisie.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectData;