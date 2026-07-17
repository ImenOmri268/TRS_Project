# 📊 Projet TRS - Suivi de la Performance Industrielle & IA (Industrie 4.0)

> **Projet de Fin d'Études (PFE)** réalisé au sein de **SWConsulting** (Février 2026 - Juin 2026).
> Soutenu avec succès le **13 Juin 2026**.

---

## 📝 À propos du projet

Ce projet consiste en une application web moderne et intelligente de monitoring industriel axée sur le calcul et la visualisation du **TRS (Taux de Rendement Synthétique)** en temps réel. L'application permet de piloter la performance d'un atelier de production à travers ses trois composantes clés : **Disponibilité**, **Performance**, et **Qualité**.

Au-delà du simple tableau de bord, la plateforme intègre un module d'**Intelligence Artificielle** pour aider les managers et opérateurs à résoudre les causes racines des pannes et arrêts machine en automatisant les plans d'action.

### 🌟 Fonctionnalités Clés
*   **Tableau de bord temps réel :** Visualisation dynamique des KPI industriels (TRS, TP, TRE) et graphiques analytiques (Recharts).
*   **Analyses Qualité & Amélioration Continue :** Modules dédiés pour structurer les analyses de pannes via les méthodes **Pareto**, **5 Pourquoi (5P)**, et **Ishikawa (Cause-Effet)**.
*   **Plans d'action générés par IA :** Intégration du LLM **Llama 3.1** (via Groq API) pour suggérer instantanément des actions correctives basées sur l'analyse industrielle saisie.
*   **Authentification & Sécurité :** Gestion des rôles (Admin / Opérateur) avec sécurisation par **JWT (JSON Web Tokens)** et hachage **Bcrypt**.
*   **Notifications & Mails :** Envoi d'alertes et de rapports par email via **Nodemailer**.

---

## 🛠️ Stack Technique

L'application utilise une architecture moderne **Full-Stack unifiée (Serverless/Monolithe)**, centralisant l'interface et l'API au sein du même framework :

*   **Frontend & Backend (API Routes) :** [Next.js (v16)](https://nextjs.org/) & React 19
*   **Design & UI :** [Tailwind CSS (v4)](https://tailwindcss.com/) & Framer Motion (animations)
*   **Base de données :** [PostgreSQL](https://www.postgresql.org/)
*   **ORM :** [Prisma](https://www.prisma.io/)
*   **Modèle d'IA :** [Llama 3.1 (8B)](https://meta.ai/) via [Groq SDK](https://groq.com/)
*   **Authentification :** JWT (`jsonwebtoken` / `jose`) & `bcryptjs`
*   **Envoi d'emails :** [Nodemailer](https://nodemailer.com/)

---

## 🚀 Installation et Démarrage Local

### 1. Prérequis
Assurez-vous d'avoir installé :
*   [Node.js](https://nodejs.org/) (version 18+ recommandée)
*   Une instance de base de données [PostgreSQL](https://www.postgresql.org/)

### 2. Cloner le projet
```bash
git clone [https://github.com/votre-utilisateur/votre-repo-trs.git](https://github.com/votre-utilisateur/votre-repo-trs.git)
cd votre-repo-trs