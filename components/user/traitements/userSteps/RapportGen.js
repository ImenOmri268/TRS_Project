'use client';
import React, { useState, useEffect } from "react";
import { FiDownload, FiFileText, FiRefreshCw } from "react-icons/fi";

const RapportGen = ({ workflowId, onGenerationComplete, isDirty }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  // 1. Vérification du statut au montage du composant ou changement d'ID
  useEffect(() => {
    if (workflowId) {
      checkPdfStatus();
    }
  }, [workflowId]);

  // 2. FORCE RE-GENERATION: Invalidation si des modifications (isDirty) sont détectées
  useEffect(() => {
    const invalidateOldPdf = async () => {
      if (isDirty && workflowId) {
        try {
          // Point de contact avec l'endpoint DELETE utilisateur
          const res = await fetch(`/api/user/workflow/${workflowId}/generate-pdf`, {
            method: "DELETE",
          });
          
          if (res.ok) {
            // On réinitialise l'état local après validation du serveur
            setPdfUrl(null); 
          }
        } catch (err) {
          console.error("Erreur lors de l'invalidation du PDF utilisateur:", err);
        }
      }
    };

    invalidateOldPdf();
  }, [isDirty, workflowId]);

  const checkPdfStatus = async () => {
    try {
      // Point de contact avec l'endpoint GET utilisateur
      const res = await fetch(`/api/user/workflow/${workflowId}/generate-pdf`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
        } else {
          setPdfUrl(null); // Affiche le bouton "Générer" si aucune référence en BDD
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut du rapport utilisateur:", err);
    }
  };

  const handleGenerateOrDownload = async () => {
    if (pdfUrl) {
      // Utilisation du cache-buster pour forcer le navigateur à télécharger le nouveau fichier généré
      const cacheBusterUrl = `${pdfUrl}?t=${new Date().getTime()}`;
      window.open(cacheBusterUrl, "_blank");
      return;
    }

    setIsGenerating(true);
    try {
      // Point de contact avec l'endpoint POST utilisateur (Puppeteer compilation)
      const res = await fetch(`/api/user/workflow/${workflowId}/generate-pdf`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setPdfUrl(data.pdfUrl); 
        if (onGenerationComplete) onGenerationComplete();
      } else {
        alert("Erreur lors de la génération du rapport.");
      }
    } catch (err) {
      console.error("Erreur génération PDF utilisateur:", err);
      alert("Impossible de joindre le serveur de traitement.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-500">
      
      {/* Indicateur visuel dynamique de l'état du document */}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-md transition-all duration-500 ${
        pdfUrl 
          ? "bg-emerald-50 text-emerald-500 ring-4 ring-emerald-100" 
          : "bg-blue-50 text-blue-500 ring-4 ring-blue-100"
      }`}>
        {isGenerating ? (
          <FiRefreshCw className="animate-spin text-3xl" />
        ) : (
          <FiFileText />
        )}
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          {pdfUrl ? "Rapport Disponible" : "Mise à jour requise"}
        </h2>
        <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm font-medium leading-relaxed">
          {pdfUrl 
            ? "L'analyse complète a été archivée avec succès. Vous pouvez télécharger le document officiel ci-dessous."
            : "Des modifications ont été détectées ou aucun rapport n'a été créé. Veuillez compiler la dernière version au format PDF."}
        </p>
      </div>
      
      {/* Panneau d'action */}
      <div className="w-full max-w-sm bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-100/50 transition-all">
        <div className="flex justify-between items-center mb-5">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Résumé du traitement</span>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
            pdfUrl 
              ? "text-emerald-600 bg-emerald-50 border border-emerald-100" 
              : "text-amber-600 bg-amber-50 border border-amber-100 animate-pulse"
          }`}>
            {pdfUrl ? "Archivé (À jour)" : "Modifié / Prêt"}
          </span>
        </div>

        <button 
          onClick={handleGenerateOrDownload}
          disabled={isGenerating}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg cursor-pointer ${
            pdfUrl 
              ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100" 
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
          }`}
        >
          {isGenerating ? (
            <>Compilation en cours...</>
          ) : pdfUrl ? (
            <>
              <FiDownload size={16} /> Télécharger le Rapport .PDF
            </>
          ) : (
            <>Générer le Nouveau Rapport</>
          )}
        </button>
      </div>
    </div>
  );
};

export default RapportGen;