
import AdminLayout from "@/components/admin/adminLayout/AdminLayout";
import AddRessourceAction from "@/components/admin/ressources/AddRessourceAction";
import TableRessources from "@/components/admin/ressources/TableRessources";
import { HiOutlineCpuChip } from "react-icons/hi2";

export default function Page() {

    const ressources = [/*
      { 
        id: 1, 
        name: "Presse Hydraulique A1", 
        description: "Presse haute précision utilisée pour le formage de composants métalliques aéronautiques.",
        objectif: ["Maintenir un TRS > 85%", "Réduire les micro-arrêts de 10%"], 
        collection: "Machine", 
        status: "Actif", 
        disponibilite: "92%", 
        performance: "85%", 
        qualite: "98%",
        champs: { disponibilité: ["Temps_Prévu", "Temps d'arrêts"], performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], qualité: ["Qté_Produite_Total", "Qté_Rebut", "Qté_Réwork"] },
        trsHistory: [
          { date: "2024-03-20", disp: "91%", perf: "84%", qual: "99%", trs: "75.6%" },
          { date: "2024-03-19", disp: "93%", perf: "86%", qual: "98%", trs: "78.4%" },
          { date: "2024-03-18", disp: "90%", perf: "82%", qual: "97%", trs: "71.5%" },
        ]
      },
      { 
        id: 2, 
        name: "Scie Circulaire B2", 
        description: "Équipement de découpe automatisé pour profilés aluminium haute densité.",
        objectif: ["Optimisation du temps de coupe", "Zéro rebut sur série B"],  
        collection: "Machine", 
        status: "Inactif", 
        disponibilite: "75%", 
        performance: "60%", 
        qualite: "80%",
        champs: { disponibilité: ["Temps_Prévu", "Temps d'arrêts"], performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], qualité: ["Qté_Produite_Total", "Qté_Rebut", "aaaaaaaaaaaa"] },
        trsHistory: [
          { date: "2024-03-15", disp: "70%", perf: "55%", qual: "80%", trs: "30.8%" },
        ]
      },{ 
        id: 3, 
        name: "Tour CNC C3", 
        description: "Tour à commande numérique haute vitesse dédié à l'usinage de précision pour pièces cylindriques complexes.",
        objectif: ["Réduction du temps de réglage", "Précision dimensionnelle à ±0.01mm"], 
        collection: "Machine", 
        status: "Actif", 
        disponibilite: "95%", 
        performance: "90%", 
        qualite: "95%",
        champs: { 
          disponibilité: ["Temps_Prévu", "Temps d'arrêts"], 
          performance: ["Qté_Produite_Total", "Temps_Unitaire_Théorique", "Temps_Opération"], 
          qualité: ["Qté_Produite_Total", "Qté_Rebut", "Qté_Réwork"] 
        },
        trsHistory: [
          { date: "2024-03-22", disp: "96%", perf: "92%", qual: "96%", trs: "84.7%" },
          { date: "2024-03-21", disp: "94%", perf: "89%", qual: "94%", trs: "78.6%" },
          { date: "2024-03-20", disp: "95%", perf: "90%", qual: "95%", trs: "81.2%" },
        ]
      }
    */];

  return (
    <AdminLayout activePage="Gestion des Ressources">
      <div className="p-8 space-y-8 animate-in fade-in duration-700">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <HiOutlineCpuChip className="text-blue-600" />
              GESTION DES RESSOURCES
            </h1>
            <p className="text-slate-500 font-medium">Supervisez la performance et l&apos;état opérationnel de vos machines.</p>
          </div>
          <AddRessourceAction /> 
        </div>
        
        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          {ressources.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCpuChip className="text-slate-400 text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Aucune ressource définie</h3>
              <p className="text-slate-500 mt-2">Commencez par créer votre première ressource.</p>
            </div>
          ) : (
            <TableRessources ressources={ressources} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}