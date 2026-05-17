'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import PipelineHeader from "@/components/admin/traitements/PipelineHeader";
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Brainstorming from "@/components/admin/traitements/steps/Brainstorming";
import ParetoSchema from "@/components/admin/traitements/steps/ParetoSchema";
import CinqP from "@/components/admin/traitements/steps/CinqP";
import Ishikawa from "@/components/admin/traitements/steps/Ishikawa";
import RapportGen from "@/components/admin/traitements/steps/RapportGen";
import { MdInfoOutline, MdAnalytics } from "react-icons/md";
import InitWorkflow from "@/components/admin/traitements/InitWorkflow";

const TraitementPage = () => {
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5; // Updated to match your 5 steps

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // We pass the workflowId to each step so they can perform specific API calls
  const renderStep = () => {
    const props = { workflowId: activeWorkflow?.id };
    
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
          /* INIT PHASE: The admin defines the global workflow here. 
             No ressourceId needed as it's global for all admin's resources.
          */
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">TRAITEMENT GLOBAL TRS</h1>
                <p className="text-slate-500 font-medium">Analysez et améliorez la performance collective de vos ressources.</p>
             </div>
             <InitWorkflow onStarted={(wf) => setActiveWorkflow(wf)} />
          </div>
        ) : (
          /* PIPELINE PHASE: The workflow is active */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Contextual Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                  <MdAnalytics size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{activeWorkflow.nom}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    Baseline TRS Global: <span className="font-bold text-blue-600">{activeWorkflow.valeurTrsGlobal}%</span>
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Workflow Actif #{activeWorkflow.id}</span>
              </div>
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
                  Étape {currentStep} / {totalSteps}
                </div>

                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-10 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
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