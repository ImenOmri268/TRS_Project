export const PERMISSIONS_CONFIG = [

  {
    categorie: "Général",
    permissions: [
      { key: "voir_dashboard", label: "Voir le dashboard" },
    ]
  },

  {
    categorie: "Utilisateurs",
    permissions: [
      { key: "voir_utilisateurs",     label: "Voir les utilisateurs" },
      { key: "ajouter_utilisateur",   label: "Ajouter un utilisateur" },
      { key: "modifier_utilisateur",  label: "Modifier un utilisateur" },
      { key: "supprimer_utilisateur", label: "Supprimer un utilisateur" },
    ]
  },

  {
    categorie: "Ressources",
    permissions: [
      { key: "voir_ressources",     label: "Voir les ressources" },
      { key: "ajouter_ressource",   label: "Ajouter une ressource" },
      { key: "modifier_ressource",  label: "Modifier une ressource" },
      { key: "supprimer_ressource", label: "Supprimer une ressource" },
    ]
  },

  {
    categorie: "Objectifs",
    permissions: [
      { key: "voir_objectifs",      label: "Voir les objectifs" },
      { key: "ajouter_objectif",    label: "Ajouter un objectif" },
      { key: "modifier_objectif",   label: "Modifier un objectif" },
      { key: "supprimer_objectif",  label: "Supprimer un objectif" },
    ]
  },

  {
    categorie: "Collecte TRS",
    permissions: [
      { key: "faire_collecte",  label: "Saisir les données TRS" },
      { key: "calculer_trs",    label: "Calculer le TRS" },
    ]
  },

 {
    categorie: "Identification des problèmes",
    permissions: [
      { key: "lancer_amelioration",      label: "Lancer un processus d'amélioration" },
      { key: "ajouter_categorie",        label: "Ajouter une catégorie de problème" },
      { key: "ajouter_probleme",         label: "Ajouter un problème" },
      { key: "modifier_probleme",        label: "Modifier un problème" },
      { key: "supprimer_probleme",       label: "Supprimer un problème" },
    ]
  },

   {
    categorie: "Analyses",
    permissions: [
      { key: "voir_pareto",       label: "Voir le diagramme Pareto (généré auto)" },
      { key: "cinq_pourquoi",     label: "Répondre aux 5 Pourquoi" },
      { key: "ishikawa",          label: "Remplir le diagramme Ishikawa" },
    ]
  },

   {
    categorie: "Rapports",
    permissions: [
      { key: "voir_rapport",   label: "Voir le rapport d'analyse" },
      { key: "exporter_pdf",   label: "Télécharger le rapport en PDF" },
    ]
  },

    {
    categorie: "Plan d'actions (IA)",
    permissions: [
      { key: "voir_plan_action",     label: "Voir le plan d'action proposé par l'IA" },
      { key: "ajouter_action",       label: "Ajouter une action au plan" },
      { key: "modifier_action",      label: "Modifier une action" },
      { key: "supprimer_action",     label: "Supprimer une action" },
    ]
  },

    {
    categorie: "Suivi des actions",
    permissions: [
      { key: "accomplir_action",   label: "Changer l'état d'une action" },
      { key: "suivre_plan_action", label: "Suivre l'avancement global du plan" },
    ]
  },
]