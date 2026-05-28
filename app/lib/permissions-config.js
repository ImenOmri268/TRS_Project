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

    ]
  },

  {
    categorie: "Suivi TRS",
    permissions: [
      { key: "suivre_trs",  label: "Suivre les indicateurs TRS" },
    ]
  },

  {
    categorie: "Analyses",
    permissions: [
      { key: "consulter_traitement",       label: "Voir les traitements" },
      { key: "generer_traitements",   label: "Générer les traitements" },

    ]
  },


    {
    categorie: "Plan d'actions (IA)",
    permissions: [
      { key: "voir_plan_action",     label: "Voir le plan d'action proposé par l'IA" },
    ]
  },

 
]