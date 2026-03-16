# CRM 🚀

> CRM complet de gestion des leads commerciaux — React + Express + MySQL + JWT


![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?logo=railway)

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture)
- [Installation locale](#-installation-locale)
- [Variables d'environnement](#-variables-denvironnement)
- [API Reference](#-api-reference)
- [Déploiement](#-déploiement)
- [Auteur](#-auteur)

---

## 🎯 Présentation

**LeadFlow CRM** est une application web fullstack permettant de gérer les leads commerciaux générés depuis des formulaires de contact. Elle offre une interface moderne pour suivre, qualifier et convertir vos prospects.

Projet réalisé dans le cadre du stage **FUTURE_FS_02** — compétences acquises : CRUD complet, intégration backend, gestion de base de données, authentification JWT et déploiement cloud.

---

## ✨ Fonctionnalités

- 📊 **Dashboard** — statistiques en temps réel (total leads, taux de conversion, répartition par statut)
- 📋 **Liste des leads** — tableau avec recherche, filtres par statut et par source
- ➕ **Ajout de leads** — formulaire avec validation (nom, email, téléphone, entreprise, source)
- 🔄 **Mise à jour du statut** — pipeline `Nouveau → Contacté → Converti`
- 📝 **Notes & suivi** — ajout de notes horodatées par lead
- 📤 **Export CSV** — export de tous les leads en un clic
- 🔐 **Authentification JWT** — accès admin sécurisé, token 8h, session persistante
- 📱 **Responsive** — interface adaptée mobile et desktop

---

## 🛠 Stack technique

### Frontend
| Technologie | Usage |
|---|---|
| React 18 + TypeScript | Interface utilisateur |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Composants UI |
| Framer Motion | Animations |
| Recharts | Graphiques |
| React Router v6 | Navigation |
| date-fns | Formatage des dates |

### Backend
| Technologie | Usage |
|---|---|
| Node.js 22 | Runtime |
| Express 4 | Framework HTTP |
| MySQL2 | Driver base de données |
| JSON Web Token | Authentification |
| dotenv | Variables d'environnement |
| cors | Gestion CORS |
| uuid | Génération d'identifiants |
| nodemon | Rechargement auto (dev) |

### Base de données
| Technologie | Usage |
|---|---|
| MySQL 8 | Stockage des leads et notes |

### Déploiement
| Service | Usage |
|---|---|
| Vercel | Hébergement frontend |
| Railway | Hébergement backend + MySQL |
| GitHub | Versioning |

---

## 🏗 Architecture

```
leadflow-crm/
│
├── src/                          # Frontend React
│   ├── components/
│   │   ├── crm/                  # Composants CRM
│   │   │   ├── StatsCards.tsx    # Cartes statistiques
│   │   │   ├── LeadsTable.tsx    # Tableau des leads
│   │   │   ├── LeadsToolbar.tsx  # Barre de recherche/filtres
│   │   │   ├── LeadDetailSheet.tsx # Panneau détail lead
│   │   │   ├── AddLeadDialog.tsx # Formulaire ajout
│   │   │   ├── LeadsByStatusChart.tsx # Graphique
│   │   │   └── StatusBadge.tsx   # Badge statut
│   │   ├── ui/                   # Composants shadcn/ui
│   │   ├── ProtectedRoute.tsx    # Guard authentification
│   │   └── LogoutButton.tsx      # Bouton déconnexion
│   ├── hooks/
│   │   ├── useLeads.ts           # Hook CRUD leads → API
│   │   └── useAuth.tsx           # Hook authentification JWT
│   ├── pages/
│   │   ├── Index.tsx             # Page principale CRM
│   │   └── LoginPage.tsx         # Page de connexion admin
│   └── types/
│       └── lead.ts               # Types TypeScript
│
└── crm-backend/                  # Backend Express
    └── src/
        ├── db/
        │   ├── pool.js           # Pool connexions MySQL
        │   └── init.js           # Script init BDD + seed
        ├── routes/
        │   ├── leads.js          # Routes CRUD /api/leads
        │   └── auth.js           # Routes /api/auth
        ├── middleware/
        │   ├── requireAuth.js    # Middleware JWT
        │   └── errorHandler.js   # Gestion erreurs
        └── index.js              # Point d'entrée Express
```

### Schéma base de données

```sql
leads
  id          CHAR(36) PK       -- UUID
  name        VARCHAR(255)
  email       VARCHAR(255)
  phone       VARCHAR(50)
  company     VARCHAR(255)
  source      ENUM('site_web','reseaux_sociaux','referral',
                   'email_campaign','evenement','autre')
  status      ENUM('nouveau','contacté','converti')
  created_at  DATETIME
  updated_at  DATETIME

notes
  id          CHAR(36) PK       -- UUID
  lead_id     CHAR(36) FK → leads.id (CASCADE DELETE)
  content     TEXT
  created_at  DATETIME
```

---

## 🚀 Installation locale

### Prérequis

- Node.js ≥ 18
- MySQL ≥ 8
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/Michel-DJREKE/FUTURE_FS_02.git
cd FUTURE_FS_02
```

### 2. Installer les dépendances frontend

```bash
npm install
```

### 3. Installer les dépendances backend

```bash
cd crm-backend
npm install
```

### 4. Configurer les variables d'environnement

```bash
# Dans crm-backend/
cp .env.example .env
```

Édite `crm-backend/.env` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ton_mot_de_passe_mysql
DB_NAME=leadflow_crm
PORT=3001
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_this_secret_in_production
JWT_EXPIRES=8h
ADMIN_EMAIL=admin@leadflow.com
ADMIN_PASSWORD=Admin1234!
```

### 5. Initialiser la base de données

```bash
# Dans crm-backend/
npm run db:init
```

Résultat attendu :
```
✅ MySQL connecté
🔧 Création de la base "leadflow_crm"…
✅ Tables créées (leads + notes)
🌱 5 leads de démo insérés
🎉 Base de données prête !
```

### 6. Démarrer l'application

**Terminal 1 — Backend :**
```bash
cd crm-backend
npm run dev
# → http://localhost:3001
```

**Terminal 2 — Frontend :**
```bash
# Depuis la racine
npm run dev
# → http://localhost:5173
```

### 7. Se connecter

Ouvre `http://localhost:5173` et connecte-toi avec :

| Champ | Valeur |
|---|---|
| Email | `admin@leadflow.com` |
| Mot de passe | `Admin1234!` |

---

## 🔑 Variables d'environnement

### Backend (`crm-backend/.env`)

| Variable | Description | Exemple |
|---|---|---|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | `monmotdepasse` |
| `DB_NAME` | Nom de la base | `leadflow_crm` |
| `PORT` | Port du serveur Express | `3001` |
| `CLIENT_URL` | URL du frontend (CORS) | `http://localhost:5173` |
| `JWT_SECRET` | Clé secrète JWT | `une_chaine_aleatoire_longue` |
| `JWT_EXPIRES` | Durée de validité du token | `8h` |
| `ADMIN_EMAIL` | Email de l'admin | `admin@leadflow.com` |
| `ADMIN_PASSWORD` | Mot de passe admin | `Admin1234!` |

### Frontend (`.env`)

| Variable | Description | Exemple |
|---|---|---|
| `VITE_API_URL` | URL de l'API backend | `http://localhost:3001/api` |

---

## 📡 API Reference

### Authentification

| Méthode | Route | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Connexion admin | ❌ |
| `GET` | `/api/auth/me` | Vérifie le token | ✅ |

**POST /api/auth/login**
```json
// Body
{ "email": "admin@leadflow.com", "password": "Admin1234!" }

// Réponse
{ "success": true, "token": "eyJ...", "admin": { "email": "..." } }
```

### Leads (toutes protégées par JWT)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/leads` | Liste tous les leads |
| `GET` | `/api/leads/stats` | Statistiques |
| `GET` | `/api/leads/:id` | Un lead avec ses notes |
| `POST` | `/api/leads` | Créer un lead |
| `PATCH` | `/api/leads/:id` | Modifier un lead |
| `DELETE` | `/api/leads/:id` | Supprimer un lead |
| `POST` | `/api/leads/:id/notes` | Ajouter une note |

**Headers requis (routes protégées) :**
```
Authorization: Bearer <token>
```

**GET /api/leads — filtres disponibles :**
```
GET /api/leads?search=alice&status=nouveau&source=site_web
```

**POST /api/leads — body :**
```json
{
  "name": "Alice Martin",
  "email": "alice@example.com",
  "phone": "+33612345678",
  "company": "Startup.io",
  "source": "site_web",
  "status": "nouveau"
}
```

### Health check

```
GET /api/health → { "status": "ok", "timestamp": "..." }
```

---

## ☁️ Déploiement

### Backend → Railway

1. Crée un compte sur [railway.app](https://railway.app)

### Frontend → Vercel

1. Crée un compte sur [vercel.com](https://vercel.com)
### Après déploiement

Mets à jour `CLIENT_URL` dans Railway avec l'URL Vercel, puis redéploie le backend.

---

## 👤 Auteur

**Michel DJREKE**
- GitHub : [@Michel-DJREKE](https://github.com/Michel-DJREKE)
- Projet : [FUTURE_FS_02](https://github.com/Michel-DJREKE/FUTURE_FS_02)

---

*Projet réalisé dans le cadre d'un stage — LeadFlow CRM v1.0.0*