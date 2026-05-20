'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import PipelineHeader from "@/components/admin/traitements/PipelineHeader";
import WorkflowSelector from "@/components/admin/traitements/WorkflowSelector";
import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Brainstorming from "@/components/admin/traitements/steps/Brainstorming";
import ParetoSchema from "@/components/admin/traitements/steps/ParetoSchema";
import CinqP from "@/components/admin/traitements/steps/CinqP";
import Ishikawa from "@/components/admin/traitements/steps/Ishikawa";
import RapportGen from "@/components/admin/traitements/steps/RapportGen";
import { MdAnalytics } from "react-icons/md";

const TraitementPage = () => {
  const [selectedRessource, setSelectedRessource] = useState(null);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const totalSteps = 5;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Exit pipeline back to workflow selection dashboard view
  const exitPipeline = () => {
    setActiveWorkflow(null);
    setCurrentStep(1);
  };

  // Helper mapping function to safely identify string type based on wizard indices
  const getStepTypeString = (stepIndex) => {
    switch (stepIndex) {
      case 1: return "BRAINSTORMING";
      case 2: return "PARETO";
      case 3: return "CINQ_POURQUOI";
      case 4: return "ISHIKAWA";
      default: return null;
    }
  };

  // NEW CENTRALIZED SAVE CONTROLLER: Saves specific step data without affecting other step records
  const handleSaveStepData = async (stepIndex, dataContent) => {
    const stepType = getStepTypeString(stepIndex);
    if (!activeWorkflow?.id || !stepType) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          type: stepType,
          contenu: typeof dataContent === "string" ? dataContent : JSON.stringify(dataContent)
        })
      });

      if (!response.ok) {
        console.error(`Failed to automatically save step structure: ${stepType}`);
      }
    } catch (err) {
      console.error("Communication error saving step sequence structural block:", err);
    } finally {
      setSaving(false);
    }
  };

  const renderStep = () => {
    const props = { 
      ressourceId: selectedRessource?.id, 
      selectedRessource,
      setSelectedRessource,
      activeWorkflow,
      setActiveWorkflow,
      // Shared callback utilities passed down to track modifications seamlessly
      onSaveStep: (data) => handleSaveStepData(currentStep, data),
      isSavingStep: saving
    };
    
    switch (currentStep) {
      case 1: return <Brainstorming {...props} />;
      case 2: return <ParetoSchema {...props} />;
      case 3: return <CinqP {...props} />;
      case 4: return <Ishikawa {...props} />;
      case 5: return <RapportGen {...props} />;
      default: return <Brainstorming {...props} />;
    }
  };

  return (
    <AdminLayout activePage="Traitements">
      <div className="p-8">
        {!activeWorkflow ? (
          /* Render layout component choice dashboard first if no active workflow session is running */
          <WorkflowSelector 
            onSelectWorkflow={(resource, workflow) => {
              setSelectedRessource(resource);
              setActiveWorkflow(workflow);
            }} 
          />
        ) : (
          /* Render standard step tracking wizard sequence pipeline */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Contextual Header containing Resource State */}
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
                className="flex items-center gap-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200/60"
              >
                <FiXCircle size={16} /> Changer Session
              </button>
            </div>

            <div className="flex flex-col gap-8 min-h-[70vh]">
              {/* Step Indicator Pipeline */}
              <PipelineHeader currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />

              {/* Dynamic Content Area */}
              <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                {renderStep()}
              </div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <FiArrowLeft size={20} /> Précédent
                </button>

                <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                  {saving ? "Sauvegarde..." : `Étape ${currentStep} / ${totalSteps}`}
                </div>

                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 px-10 py-3 rounded-xl font-bold transition-all active:scale-95"
                >
                  {currentStep === totalSteps ? (
                    <span className="flex items-center gap-2">Générer Rapport <FiCheckCircle size={20} /></span>
                  ) : (
                    <span className="flex items-center gap-2">Suivant <FiArrowRight size={20} /></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TraitementPage;