'use client'
import React from "react";
import { FiCpu, FiBarChart2, FiHelpCircle, FiShare2, FiFileText } from "react-icons/fi";

const PipelineHeader = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, name: "Brainstorming", icon: <FiCpu /> },
    { id: 2, name: "Pareto", icon: <FiBarChart2 /> },
    { id: 3, name: "5 Pourquoi", icon: <FiHelpCircle /> },
    { id: 4, name: "Ishikawa", icon: <FiShare2 /> },
    { id: 5, name: "Rapport", icon: <FiFileText /> },
  ];

  return (
    <div className="w-full py-6 px-2 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div 
              className="group flex flex-col items-center gap-3 relative z-10 cursor-pointer" 
              onClick={() => onStepClick(step.id)}
            >
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 shadow-sm relative
                ${currentStep >= step.id 
                  ? 'bg-blue-600 text-white shadow-blue-200' 
                  : 'bg-white border border-slate-200 text-slate-400 group-hover:border-blue-300 group-hover:text-blue-400'
                }
                ${currentStep === step.id ? 'ring-4 ring-blue-500/10 scale-110' : 'scale-100'}
              `}>
                {step.icon}
                
                {/* Status Indicator Dot */}
                {currentStep > step.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-2.5 border-r-2 border-b-2 border-white rotate-45 mb-0.5" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] font-black uppercase tracking-tighter transition-colors duration-300 ${
                currentStep >= step.id ? 'text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {step.name}
              </span>
            </div>

            {/* Connecting Line (Progress Bar) */}
            {index !== steps.length - 1 && (
              <div className="flex-1 h-1 bg-slate-200 mx-4 rounded-full overflow-hidden relative -mt-7">
                <div 
                  className="absolute inset-0 bg-blue-500 transition-all duration-700 ease-in-out" 
                  style={{ width: currentStep > step.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PipelineHeader;