# Juridique App (Express + React + MySQL)

Réalisé par : Raed Zayoud

## Prérequis

- Node.js 18+
- MySQL 8+
- XAMPP (ou équivalent) si vous utiliser un serveur MySQL local facilement

## Installation

1. Cloner / Décompresser le ZIP dans un dossier local.
2. Créer la base MySQL (option 1: script SQL, option 2: Sequelize sync):
   - Importer `sql/database.sql` dans MySQL (recommandé) OU laisser Sequelize créer les tables au démarrage.
3. Backend
   - Copier `backend/.env.example` vers `backend/.env` et renseigner vos valeurs.
   - Dans `backend/`, exécuter:
     ```bash
     npm install
     cd src
     node server.js
     ```
   - API: http://localhost:4000
4. Frontend
   - Copier `frontend/.env.example` vers `frontend/.env` (par défaut http://localhost:4000/api).
   - Dans `frontend/`, exécuter:
     ```bash
     npm install
     npm run dev
     ```
   - UI: http://localhost:5173

## Comptes

- Administrateur: email `admin@test.com`, mot de passe `Admin123!` (créé automatiquement au premier démarrage si absent)

## Fonctionnalités

- Authentification JWT (login, middleware de protection)
- Rôles: admin, agent
- CRUD Communes (admin)
- CRUD Thèmes (admin)
- CRUD Utilisateurs (admin)
- Interventions: créer, modifier, répondre, changer statut
- Pièces jointes: upload fichier lié à une intervention
- Tableau de bord: stats (total, en cours, traitées, archivées, top thèmes, top communes)

## Décisions techniques

- ORM: Sequelize (MySQL) pour accélérer les relations et validations basiques.
- Vite + React pour un front léger et rapide.
- Sécurité: bcrypt pour hash mots de passe, JWT pour sessions stateless, CORS restreint au front local.

## Notes

- Travail réalisé seul
- Variables importantes: `JWT_SECRET`, `DB_*`, `BASE_URL`, `UPLOAD_DIR`.
- Les erreurs sont retournées en JSON, aucune stack trace en production.
- Le code inclut une validation minimale côté backend via `express-validator`.
