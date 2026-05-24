'use client';
import React, { useState, useEffect } from "react";
import UserLayout from "@/components/user/userLayout/UserLayout";
import TableTraitements from "@/components/user/traitements/TableTraitements";

// Composants du pipeline importés pour la vue interactive (acceder_traitements)
import PipelineHeader from "@/components/admin/traitements/PipelineHeader";
import WorkflowSelector from "@/components/user/traitements/WorkflowSelector";
import Brainstorming from "@/components/admin/traitements/steps/Brainstorming";
import ParetoSchema from "@/components/admin/traitements/steps/ParetoSchema";
import CinqP from "@/components/admin/traitements/steps/CinqP";
import Ishikawa from "@/components/admin/traitements/steps/Ishikawa";
import RapportGen from "@/components/admin/traitements/steps/RapportGen";

import { usePermissions } from "@/app/lib/hooks/usePermissions";
import { FiLock, FiLayers, FiRefreshCw, FiArrowRight, FiArrowLeft, FiXCircle } from "react-icons/fi";
import { MdAnalytics } from "react-icons/md";

export default function TraitementsPage() {
  const { can, loading: permissionsLoading } = usePermissions();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  // États spécifiques au pipeline d'analyse interactive
  const [selectedRessource, setSelectedRessource] = useState(null);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  const totalSteps = 5;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const exitPipeline = () => {
    setActiveWorkflow(null);
    setCurrentStep(1);
  };

  const getStepTypeString = (stepIndex) => {
    switch (stepIndex) {
      case 1: return "BRAINSTORMING";
      case 2: return "PARETO";
      case 3: return "CINQ_POURQUOI";
      case 4: return "ISHIKAWA";
      default: return null;
    }
  };

  // Chargement de l'historique global en lecture seule pour 'voir_traitements'
  const fetchTraitementsReadOnly = async () => {
    setLoading(true);
    try {
      // On construit l'URL de manière sécurisée
      const url = selectedRessource?.id 
        ? `/api/user/workflow/view?ressourceId=${selectedRessource.id}`
        : `/api/user/workflow/view`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // On cible précisément la clé .workflows configurée dans l'API
        setWorkflows(data.workflows || []);
      }
    } catch (err) {
      console.error("Erreur récupération des traitements en lecture seule", err);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionsLoading && can('voir_traitements') && !can('acceder_traitements')) {
      fetchTraitementsReadOnly();
    }
  }, [permissionsLoading, refreshTrigger, selectedRessource]);

  const handleOuvrirTraitementTableau = async (workflow) => {
    if (!workflow) return;
    
    // Si l'URL du PDF existe déjà, on l'ouvre directement
    if (workflow.pdfUrl) {
      window.open(workflow.pdfUrl, "_blank");
      return;
    }

    // Sinon, on tente de charger dynamiquement les détails et les analyses via l'API "View"
    try {
      const res = await fetch(`/api/user/workflow/view?workflowId=${workflow.id}`);
      if (res.ok) {
        const fullDetails = await res.json();
        if (fullDetails.pdfUrl) {
          window.open(fullDetails.pdfUrl, "_blank");
        } else {
          alert("Aucun rapport PDF n'a été compilé pour cette session. Les étapes enregistrées en base de données restent consultables par un agent autorisé.");
        }
      } else {
        alert("Impossible de charger les détails de ce traitement (Erreur 404/500).");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des détails du workflow:", err);
    }
  };

  // Sauvegarde interactive des étapes (Uniquement pour 'acceder_traitements')
  const handleSaveStepData = async (stepIndex, dataContent) => {
    const stepType = getStepTypeString(stepIndex);
    if (!activeWorkflow?.id || !stepType) return;

    setSaving(true);
    try {
      const response = await fetch("/api/user/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          type: stepType,
          contenu: typeof dataContent === "string" ? dataContent : JSON.stringify(dataContent)
        })
      });

      if (response.ok) {
        setIsDirty(true);
      } else {
        console.error(`Failed to automatically save step structure: ${stepType}`);
      }
    } catch (err) {
      console.error("Communication error saving step sequence structural block:", err);
    } finally {
      setSaving(false);
    }
  };

  const handlePdfGenerationSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsDirty(false);
  };

  const renderStep = () => {
    const props = { 
      ressourceId: selectedRessource?.id, 
      selectedRessource,
      setSelectedRessource,
      activeWorkflow,
      setActiveWorkflow,
      onSaveStep: (data) => handleSaveStepData(currentStep, data),
      isSavingStep: saving
    };
    
    switch (currentStep) {
      case 1: return <Brainstorming {...props} />;
      case 2: return <ParetoSchema {...props} />;
      case 3: return <CinqP {...props} />;
      case 4: return <Ishikawa {...props} />;
      case 5: return (
        <RapportGen 
          workflowId={activeWorkflow?.id} 
          isDirty={isDirty}
          onGenerationComplete={handlePdfGenerationSuccess}
        />
      );
      default: return <Brainstorming {...props} />;
    }
  };

  if (permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-xs font-black text-slate-400 tracking-widest uppercase">Chargement des modules...</div>
      </div>
    );
  }

  if (!can('voir_traitements') && !can('acceder_traitements')) {
    return (
      <UserLayout activePage="Sécurité">
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-sm max-w-2xl mx-auto mt-12">
          <div className="p-4 bg-rose-50 text-rose-500 rounded-full mb-4">
            <FiLock size={40} />
          </div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Accès Privilégié</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Habilitation insuffisante. Vous devez posséder le droit d&apos;inspection ou de modification des analyses industrielles pour accéder aux Traitements.
          </p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout activePage="Traitements">
      {can('acceder_traitements') ? (
        <div className="p-2">
          {!activeWorkflow ? (
            <WorkflowSelector 
              refreshTrigger={refreshTrigger}
              onSelectWorkflow={(resource, workflow) => {
                setSelectedRessource(resource);
                setActiveWorkflow(workflow);
                setIsDirty(false);
              }} 
            />
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                    <MdAnalytics size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Analyse : {selectedRessource?.nom}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Session active : <span className="font-semibold text-blue-600">{activeWorkflow.nom || `Session #${activeWorkflow.id}`}</span>
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={exitPipeline}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200/60 cursor-pointer"
                >
                  <FiXCircle size={16} /> Changer Session
                </button>
              </div>

              <div className="flex flex-col gap-8 min-h-[70vh]">
                <PipelineHeader currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                  {renderStep()}
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <button 
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all cursor-pointer ${
                      currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <FiArrowLeft size={20} /> Précédent
                  </button>

                  <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                    {saving ? "Sauvegarde..." : `Étape ${currentStep} / ${totalSteps}`}
                  </div>

                  <button 
                    onClick={currentStep === totalSteps ? undefined : nextStep}
                    disabled={currentStep === totalSteps}
                    className={`flex items-center gap-2 text-white shadow-xl px-10 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                      currentStep === totalSteps 
                        ? 'bg-slate-300 shadow-none opacity-50 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 cursor-pointer'
                    }`}
                  >
                    <span className="flex items-center gap-2">Suivant <FiArrowRight size={20} /></span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
                <FiLayers className="text-blue-600" size={26} />
                Traitements & Analyses
              </h1>
              <p className="text-slate-400 text-xs ml-1">
                Suivi global des processus de résolution de problèmes (méthodes Lean et rapports de consultation).
              </p>
            </div>

            <button 
              onClick={fetchTraitementsReadOnly}
              className="flex items-center gap-2 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Actualiser la liste"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Analyse de l&apos;historique en cours...
            </div>
          ) : workflows.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 text-center py-20 px-4 space-y-2">
              <p className="text-slate-800 font-black text-lg">Aucun traitement disponible</p>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Aucune session réglementaire de traitement n&apos;est actuellement indexée pour la consultation.
              </p>
            </div>
          ) : (
            <TableTraitements 
              workflows={workflows}
              onOuvrirTraitement={handleOuvrirTraitementTableau}
            />
          )}
        </div>
      )}
    </UserLayout>
  );
}