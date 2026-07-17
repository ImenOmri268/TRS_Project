'use client'
import React from "react";
import { FiCpu, FiBarChart2, FiHelpCircle, FiShare2, FiFileText } from "react-icons/fi";

const PipelineHeader = ({ currentStep, onStepClick }) => {
  const steps = [
    { id: 1, name: "Identification des Problèmes", icon: <FiCpu /> },
    { id: 2, name: "Pareto", icon: <FiBarChart2 /> },
    { id: 3, name: "5 Pourquoi", icon: <FiHelpCircle /> },
    { id: 4, name: "Ishikawa", icon: <FiShare2 /> },
    { id: 5, name: "Rapport", icon: <FiFileText /> },
  ];

  return (
    <div className="w-full py-8 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between max-w-5xl mx-auto relative">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label Wrapper */}
              <div 
                className="group flex flex-col items-center gap-3 relative z-10 cursor-pointer" 
                onClick={() => onStepClick(step.id)}
              >
                {/* Perfect Circle Container */}
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all duration-500 relative
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100 scale-110 font-bold' 
                    : isCompleted
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100 scale-110 font-bold' 
                    : 'bg-slate-50 border-2 border-slate-200 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-white'
                  }
                `}>
                  {/* Fluid Dynamic Icon / Number State */}
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {isActive || isCompleted ? step.icon : step.id}
                  </span>
                  
                  
                </div>

                {/* Micro-Typography Step Subtitle Label */}
                <span className={`text-[10px] font-bold uppercase tracking-wider max-w-[120px] text-center transition-colors duration-300 ${
                  isActive 
                    ? 'text-blue-600 font-extrabold' 
                    : isCompleted 
                    ? 'text-blue-600' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {step.name}
                </span>
              </div>

              {/* Centered Connecting Progress Line Track */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-[3px] bg-slate-100 mx-2 rounded-full overflow-hidden relative -mt-6">
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700 ease-in-out" 
                    style={{ 
                      width: isCompleted ? '100%' : '0%',
                      transformOrigin: 'left'
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineHeader;