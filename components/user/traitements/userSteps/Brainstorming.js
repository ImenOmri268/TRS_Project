'use client'
import React, { useState, useEffect } from "react";
import { 
  MdAddCircleOutline, MdClose, 
  MdSave, MdNewLabel 
} from "react-icons/md";

const Brainstorming = ({ selectedRessource, activeWorkflow, onSaveStep }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: "", problems: [{ id: 1, text: "" }] }
  ]);

  // Fetch existing problem configuration linked strictly to this active workflow session
  useEffect(() => {
    const fetchExistingProblems = async () => {
      if (!activeWorkflow?.id) return;
      try {
        // ADAPTATION : Appel du nouvel endpoint unifié du pipeline avec l'ID du workflow
        const response = await fetch(`/api/user/workflow/pipeline?workflowId=${activeWorkflow.id}`);
        if (response.ok) {
          const data = await response.json();
          
          // ADAPTATION : L'API retourne directement le tableau brut des lignes d'analyses associées
          const brainstormingData = Array.isArray(data) 
            ? data.find(analysis => analysis.type === "BRAINSTORMING")
            : null;

          if (brainstormingData && brainstormingData.contenu) {
            setCategories(JSON.parse(brainstormingData.contenu));
          } else {
            // Reset to empty template form structure if this is a fresh workspace session path
            setCategories([{ id: 1, name: "", problems: [{ id: 1, text: "" }] }]);
          }
        }
      } catch (err) {
        console.error("Error loading workflow brainstorming problem data:", err);
      }
    };
    fetchExistingProblems();
  }, [activeWorkflow]);

  // Dynamic Structure Form Modifiers
  const addCategoryBlock = () => {
    const nextCatId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, {
      id: nextCatId,
      name: "",
      problems: [{ id: 1, text: "" }]
    }]);
  };

  const removeCategoryBlock = (catId) => {
    if (categories.length === 1) return;
    setCategories(categories.filter(c => c.id !== catId));
  };

  const updateCategoryName = (catId, val) => {
    setCategories(categories.map(c => c.id === catId ? { ...c, name: val } : c));
  };

  const addProblemLine = (catId) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      const nextProbId = c.problems.length > 0 ? Math.max(...c.problems.map(p => p.id)) + 1 : 1;
      return {
        ...c,
        problems: [...c.problems, { id: nextProbId, text: "" }]
      };
    }));
  };

  const removeProblemLine = (catId, probId) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      if (c.problems.length === 1) {
        return { ...c, problems: [{ id: 1, text: "" }] };
      }
      return { ...c, problems: c.problems.filter(p => p.id !== probId) };
    }));
  };

  const updateProblemData = (catId, probId, field, val) => {
    setCategories(categories.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        problems: c.problems.map(p => p.id === probId ? { ...p, [field]: val } : p)
      };
    }));
  };

  const handleSaveData = async () => {
    if (!selectedRessource?.id || !activeWorkflow?.id) {
      return alert("Session de traitement ou ressource introuvable.");
    }

    // Filter out completely empty rows to preserve clean database payloads
    const filteredContent = categories
      .map(c => ({
        ...c,
        problems: c.problems.filter(p => p.text.trim() !== "")
      }))
      .filter(c => c.name.trim() !== "" && c.problems.length > 0);

    if (filteredContent.length === 0) {
      return alert("Veuillez remplir au moins une catégorie valide avec ses problèmes associés.");
    }

    setLoading(true);
    try {
      // ADAPTATION : Envoi des données en POST vers l'endpoint unifié du pipeline
      const response = await fetch("/api/user/workflow/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId: activeWorkflow.id,
          ressourceId: selectedRessource.id,
          type: "BRAINSTORMING", 
          contenu: JSON.stringify(filteredContent)
        }),
      });

      if (response.ok) {
        // Trigger background parent runtime listener state synchronization safely if provided
        if (typeof onSaveStep === "function") {
          onSaveStep(filteredContent);
        }
        alert("Brainstorming et identification des problèmes enregistrés avec succès !");
      } else {
        const errorData = await response.json();
        alert(`Erreur de sauvegarde: ${errorData.error || "Inconnue"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 min-h-[55vh]">
      
      {/* Workspace Header Panel */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Identification des Problèmes (Brainstorming)</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Classifiez par catégories les anomalies détectées pour la ressource <span className="font-semibold text-blue-600">{selectedRessource?.nom}</span>.
          </p>
        </div>
        <button 
          onClick={handleSaveData}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-40 active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><MdSave size={18} /> Enregistrer l&apos;Étape</>
          )}
        </button>
      </div>

      {/* Dynamic Category Grouping List Wrapper */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 max-h-[45vh] custom-scrollbar">
        {categories.map((cat, catIdx) => (
          <div key={cat.id} className="bg-slate-50/50 border border-slate-200/70 rounded-2xl p-5 relative space-y-4 transition-all hover:bg-slate-50/80">
            
            {/* Category Header Row */}
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3 flex-1 max-w-xl">
                <MdNewLabel className="text-slate-400 shrink-0" size={20} />
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => updateCategoryName(cat.id, e.target.value)}
                  placeholder={`Nom de la Catégorie #${catIdx + 1} (ex: Matériel, Méthode, Milieu, Main d'œuvre)...`}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/5 transition-all"
                />
              </div>
              {categories.length > 1 && (
                <button
                  onClick={() => removeCategoryBlock(cat.id)}
                  className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer la catégorie"
                >
                  <MdClose size={18} />
                </button>
              )}
            </div>

            {/* Nested Problem Lines Entry Area */}
            <div className="space-y-2.5 pl-6 border-l-2 border-slate-200/80">
              {cat.problems.map((prob) => (
                <div key={prob.id} className="flex items-center gap-3 group/line">
                  <input
                    type="text"
                    value={prob.text}
                    onChange={(e) => updateProblemData(cat.id, prob.id, "text", e.target.value)}
                    placeholder="Saisir un dysfonctionnement ou écart spécifique..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-400 transition-all"
                  />
                  
                  <button
                    onClick={() => removeProblemLine(cat.id, prob.id)}
                    className="text-slate-300 hover:text-red-500 p-1 rounded-lg transition-colors opacity-60 group-hover/line:opacity-100"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ))}

              {/* Action Button to generate single internal code line */}
              <button
                onClick={() => addProblemLine(cat.id)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow-none transition-all active:scale-95"
              >
                <MdAddCircleOutline size={14} /> Ajouter un problème
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Workspace Footer Global Operations Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <button
          onClick={addCategoryBlock}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 font-bold text-xs hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm active:scale-95"
        >
          <MdAddCircleOutline size={18} /> Nouvelle Catégorie
        </button>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
          {categories.reduce((acc, curr) => acc + curr.problems.filter(p => p.text.trim() !== "").length, 0)} Faits Répertoriés
        </div>
      </div>

    </div>
  );
};

export default Brainstorming;