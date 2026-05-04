'use client'
import React, { useState } from "react";
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import PipelineHeader from "@/components/admin/traitements/PipelineHeader";
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import CollectData from "@/components/admin/traitements/steps/CollectData";
import Brainstorming from "@/components/admin/traitements/steps/Brainstorming";
import ParetoSchema from "@/components/admin/traitements/steps/ParetoSchema";
import CinqP from "@/components/admin/traitements/steps/CinqP";
import Ishikawa from "@/components/admin/traitements/steps/Ishikawa";
import RapportGen from "@/components/admin/traitements/steps/RapportGen";

const TraitementPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <CollectData />;
      case 2: return <Brainstorming />;
      case 3: return <ParetoSchema />;
      case 4: return <CinqP />;
      case 5: return <Ishikawa />;
      case 6: return <RapportGen />;
      default: return <CollectData />;
    }
  };

  return (
    <AdminLayout activePage="Traitements">
      <div className="flex flex-col gap-8 min-h-[80vh] ">
        
        {/* Step Indicator Pipeline */}
        <PipelineHeader currentStep={currentStep} onClick={(step) => setCurrentStep(step)} />

        {/* Dynamic Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {renderStep()}
        </div>

        {/* Navigation Footer */}
        <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <button 
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiArrowLeft /> Précédent
          </button>

          <button 
            onClick={nextStep}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#3B82F6] text-white font-semibold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {currentStep === totalSteps ? (
              <span className="flex items-center gap-2">Terminer <FiCheckCircle /></span>
            ) : (
              <span className="flex items-center gap-2">Suivant <FiArrowRight /></span>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TraitementPage;