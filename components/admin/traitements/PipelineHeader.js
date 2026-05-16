import React from "react";
import { FiCpu, FiBarChart2, FiHelpCircle, FiShare2, FiFileText } from "react-icons/fi";

const PipelineHeader = ({ currentStep, onClick }) => {
  const steps = [
    { id: 1, name: "Brainstorming", icon: <FiCpu /> },
    { id: 2, name: "Pareto", icon: <FiBarChart2 /> },
    { id: 3, name: "5 Pourquoi", icon: <FiHelpCircle /> },
    { id: 4, name: "Ishikawa", icon: <FiShare2 /> },
    { id: 5, name: "Rapport", icon: <FiFileText /> },
  ];

  return (
    <div className="w-full py-4 overflow-x-auto ">
      <div className="flex items-center justify-between min-w-200 px-4 ">
        {steps.map((step, index) => (
          //react fragment is used to regroup different elements without adding extra node to the DOM
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-3 relative z-10 pointer-cursor" onClick={() => onClick(step.id)}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 shadow-sm ${
                currentStep >= step.id 
                ? 'bg-[#3B82F6] text-white' 
                : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {step.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                currentStep >= step.id ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {step.name}
              </span>
            </div>

            {/* Connecting Line */}
            {index !== steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-200 mx-2 relative -mt-6">
                <div 
                  className="absolute inset-0 bg-blue-500 transition-all duration-500" 
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