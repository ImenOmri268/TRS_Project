'use client'
import React, { useState, useEffect } from "react";
import { FiPlus, FiFolder, FiCpu, FiCornerDownRight, FiFileText, FiActivity, FiTrash2 } from "react-icons/fi";

const WorkflowSelector = ({ onSelectWorkflow }) => {
  const [resources, setResources] = useState([]);
  const [activeResource, setActiveResource] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [creating, setCreating] = useState(false);

  // 1. Initial load of resources list
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/admin/ressources"); 
        const data = await res.json();
        setResources(data || []);
        if (data && data.length > 0) {
          setActiveResource(data[0]); 
        }
      } catch (err) {
        console.error("Error loading resources selector:", err);
      } finally {
        setLoadingResources(false);
      }
    };
    fetchResources();
  }, []);

  // 2. Fetch specific workflows whenever active resource changes
  useEffect(() => {
    const fetchWorkflowsForResource = async () => {
      if (!activeResource?.id) return;
      setLoadingWorkflows(true);
      try {
        const res = await fetch(`/api/admin/workflow?ressourceId=${activeResource.id}`);
        const data = await res.json();
        setWorkflows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading linked resource workflows:", err);
      } finally {
        setLoadingWorkflows(false);
      }
    };
    fetchWorkflowsForResource();
  }, [activeResource]);

  // 3. Create a brand new workflow session loop
  const handleCreateWorkflow = async (e) => {
    e.preventDefault();
    if (!newWorkflowName.trim() || !activeResource) return;

    setCreating(true);
    try {
      const res = await fetch("/api/admin/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ressourceId: activeResource.id,
          nom: newWorkflowName.trim()
        })
      }); 
      
      if (res.ok) {
        const createdWorkflow = await res.json();
        setNewWorkflowName("");
        onSelectWorkflow(activeResource, createdWorkflow);
      } else {
        alert("Erreur lors du déploiement du nouveau workflow de traitement.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur de communication API.");
    } finally {
      setCreating(false);
    }
  };

  // ADDED: Isolated Workflow Removal Event Loop
  const handleDeleteWorkflow = async (e, workflowId) => {
    e.stopPropagation(); // Stop parent onClick from executing selection route

    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette session ainsi que toutes ses analyses (Pareto, 5P, Ishikawa...) ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/workflow?workflowId=${workflowId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        // Remove item instantly from local state array tracking
        setWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
      } else {
        const errData = await res.json();
        alert(`Erreur lors de la suppression: ${errData.error || "Inconnue"}`);
      }
    } catch (err) {
      console.error("Error deleting workflow execution session loop:", err);
      alert("Une erreur de communication est survenue avec le serveur.");
    }
  };

  if (loadingResources) {
    return (
      <div className="bg-white rounded-[2rem] border border-slate-200 p-20 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initialisation du gestionnaire analytique...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[70vh] ">
      
      {/* LEFT COLUMN: AVAILABLE RESOURCES PANELS */}
      <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-200/80 p-6 flex flex-col gap-4 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FiCpu className="text-blue-600" /> Ressources Disponibles
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Sélectionnez un appareil ou un axe à analyser.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 max-h-[55vh] pr-1">
          {resources.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">Aucune ressource répertoriée.</div>
          ) : (
            resources.map((res) => (
              <button
                key={res.id}
                onClick={() => setActiveResource(res)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                  activeResource?.id === res.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                    : "bg-slate-50/60 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3 z-10">
                  <div className={`p-2.5 rounded-xl transition-colors ${activeResource?.id === res.id ? "bg-white/10" : "bg-white border border-slate-200 shadow-sm"}`}>
                    <FiFolder size={16} className={activeResource?.id === res.id ? "text-white" : "text-slate-500"} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{res.nom}</h4>
                    <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${activeResource?.id === res.id ? "text-blue-200" : "text-slate-400"}`}>
                      {res.type || "Standard"}
                    </p>
                  </div>
                </div>
                <FiCornerDownRight className={`opacity-0 transition-all transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${activeResource?.id === res.id ? "text-white" : "text-blue-600"}`} />
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: WORKFLOW LIFECYCLE LIST AND CREATION INPUT FOOTER */}
      <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-200/80 p-6 flex flex-col justify-between shadow-sm relative">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <FiActivity className="text-emerald-500" /> Historique des Sessions
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Ressource : <span className="font-bold text-slate-600">{activeResource?.nom || "Aucune"}</span>
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[42vh] pr-1">
            {loadingWorkflows ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/40">
                Aucun historique trouvé. Utilisez la barre ci-dessous pour lancer un nouveau traitement.
              </div>
            ) : (
              workflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => onSelectWorkflow(activeResource, wf)}
                  className="w-full text-left p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer animate-in fade-in-50 duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                        {wf.nom}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                        Lancé le : {new Date(wf.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* ACTION TRIGGER BUTTONS AREA */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* View Report Icon Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onSelectWorkflow(activeResource, wf); 
                      }}
                      className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                      title="Voir Rapport Technique"
                    >
                      <FiFileText size={16} />
                    </button>

                    {/* ADDED: Delete Workflow Session Button */}
                    <button 
                      onClick={(e) => handleDeleteWorkflow(e, wf.id)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
                      title="Supprimer cette session"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* INTEGRATED INPUT FORM GENERATION FOOTER BAR */}
        <form onSubmit={handleCreateWorkflow} className="border-t border-slate-100 pt-4 mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              required
              disabled={creating || !activeResource}
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder={activeResource ? `Nommer la nouvelle session pour ${activeResource.nom}...` : "Sélectionnez d'abord une ressource..."}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
            <button
              type="submit"
              disabled={creating || !newWorkflowName.trim() || !activeResource}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <FiPlus size={16} /> {creating ? "Création..." : "Lancer"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default WorkflowSelector;