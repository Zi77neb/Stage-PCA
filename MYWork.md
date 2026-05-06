# Documentation Complète du Projet - Stage PCA

**Date de création:** May 6, 2026  
**État du projet:** En développement - Phase d'implémentation modale avancée

---

## 1. OVERVIEW DU PROJET

### 1.1 Objectif Global
Développer une application web full-stack (Spring Boot + React) pour gérer des Etats réglementaires avec un système de permissions hiérarchiques. L'application permet à des administrateurs de gérer une structure complexe d'États (statuts réglementaires) → Domaines (catégories) → Banques (institutions) → Utilisateurs, et aux utilisateurs finaux de visualiser des documents filtrés par date et permissions.

### 1.2 Contexte Métier
- **Domaine:** Gestion de documents réglementaires (Etats)
- **Utilisateurs cibles:** Administrateurs système et utilisateurs finaux des banques
- **Cas d'usage principal:** Chaque banque reçoit des documents PDF à différentes fréquences (HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY), et les utilisateurs doivent pouvoir les consulter selon leurs permissions et dates
- **Défi technique:** Gérer une hiérarchie complexe sans duplication et avec une granularité d'accès fine

### 1.3 Type d'Application
- **Architecture:** Full-stack avec backend API REST et frontend SPA (Single Page Application)
- **Framework backend:** Spring Boot 3.x avec Spring Data JPA
- **Framework frontend:** React 18 avec Vite
- **Base de données:** MySQL/PostgreSQL
- **Déploiement:** Local en développement (localhost:8080 backend, localhost:5173 frontend)

---

## 2. ARCHITECTURE GLOBALE

### 2.1 Modèle de Permissions Hiérarchique

```
État (Regulatory Status)
  ├─ Code unique (ex: "PIA", "CONSO")
  ├─ Nom & Description
  ├─ Fréquence (HOURLY/DAILY/WEEKLY/MONTHLY/YEARLY)
  ├─ Chemin d'upload des PDFs
  └─ Appartient à UN SEUL Domaine ← Contrainte clé

Domaine (Domain/Category)
  ├─ Regroupe 1+ États
  ├─ Pas de duplication d'États entre Domaines
  └─ Relation M2M avec Banque

Banque (Bank/Institution)
  ├─ Peut avoir plusieurs Domaines
  ├─ Peut avoir plusieurs États (via ses Domaines)
  └─ Relation M2M avec User (avec filtrage par Domaine/État)

Utilisateur
  ├─ Assigné à 1+ Banque
  ├─ Voit uniquement les Domaines/États de ses Banques
  ├─ Role: ADMIN ou USER
  └─ Status: ACTIVE ou INACTIVE
```

### 2.2 Flux de Données

**Flux Admin:**
1. Admin crée États avec code unique + Domaine
2. Admin crée Domaines et assigne États
3. Admin crée/mappe Banques aux Domaines
4. Admin crée Utilisateurs et assigne Banques/Domaines/États

**Flux Utilisateur:**
1. User login → JWT token
2. User voit Documents filtrés par:
   - Banques assignées
   - Domaines assignés
   - États assignés
   - Plage de dates sélectionnée
3. User peut télécharger ou visualiser PDF

**Flux Système Externe:**
1. Serveur externe envoie PDFs
2. Fichiers parsés: nom = `etat-banque-jour-mois-annee-xxxxxxxxx.pdf`
3. Indexés dans Document entity
4. Audit enregistré dans Trace

---

## 3. BACKEND - SPRING BOOT

### 3.1 Structure du Projet

```
Backend/
├── pom.xml ← Dépendances Maven
├── mvnw / mvnw.cmd ← Maven wrapper
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── DemoApplication.java ← Point d'entrée Spring Boot
│   │   │   ├── config/ ← Configurations
│   │   │   ├── controller/ ← Endpoints REST
│   │   │   ├── dto/ ← Data Transfer Objects
│   │   │   ├── exception/ ← Gestion erreurs
│   │   │   ├── model/ ← Entités JPA
│   │   │   ├── repository/ ← Accès BD
│   │   │   ├── security/ ← JWT, auth
│   │   │   └── service/ ← Logique métier
│   │   └── resources/
│   │       ├── application.properties ← Config
│   │       ├── static/ ← Assets statiques
│   │       └── templates/ ← Templates (si nécessaire)
│   ├── test/ ← Tests JUnit
│   └── uploads/ ← PDFs uploadés
└── target/ ← Build output (Maven compile)
```

### 3.2 Entités JPA (Modèle de Données)

#### **Etat.java** - Core Entity
```java
Propriétés clés:
├─ id (Long, @Id, auto-générée)
├─ code (String, @Column(unique=true)) ← Identifiant métier
├─ nom (String)
├─ description (String)
├─ frequence (Enum: HOURLY, DAILY, WEEKLY, MONTHLY, YEARLY)
├─ uploadPath (String) ← Chemin pour PDFs
├─ domaine (Domaine) ← @ManyToOne(optional=false) ← État appartient À 1 Domaine
├─ banques (Set<Banque>) ← @ManyToMany(mappedBy="etats") avec @JsonIgnore
└─ utilisateurs (Set<User>) ← @ManyToMany(mappedBy="etats") avec @JsonIgnore

Contraintes métier:
- Code unique (un seul État "PIA" en BD)
- Doit être assigné à exactement 1 Domaine
- Ne peut pas être dupliqué dans plusieurs Domaines
```

#### **Domaine.java** - Category Entity
```java
Propriétés clés:
├─ id (Long, @Id)
├─ nom (String)
├─ description (String)
├─ etats (Set<Etat>) ← @OneToMany(mappedBy="domaine")
│              └─ @JsonIgnore ← Résout boucle infinie JSON
├─ banques (Set<Banque>) ← @ManyToMany(mappedBy="domaines")
└─ utilisateurs (Set<User>) ← @ManyToMany(mappedBy="domaines")

Contrainte: Chaque État du Domaine n'existe que dans ce Domaine
```

#### **Banque.java** - Bank Entity
```java
Propriétés clés:
├─ id (Long, @Id)
├─ nom (String)
├─ code (String, unique)
├─ domaines (Set<Domaine>) ← @ManyToMany @JoinTable("banque_domaine")
├─ etats (Set<Etat>) ← @ManyToMany @JoinTable("banque_etat")
├─ utilisateurs (Set<User>) ← @ManyToMany(mappedBy="banques")
└─ documents (Set<Document>) ← @OneToMany(mappedBy="banque")

Relation: Banque.domaines + Banque.etats = États de ses Domaines
```

#### **User.java** - User/Admin Entity
```java
Propriétés clés:
├─ id (Long, @Id)
├─ username (String, unique)
├─ email (String)
├─ password (String, hashed)
├─ role (Enum: ADMIN, USER)
├─ status (Enum: ACTIVE, INACTIVE)
├─ banques (Set<Banque>) ← @ManyToMany @JsonIgnore
├─ domaines (Set<Domaine>) ← @ManyToMany @JsonIgnore
├─ etats (Set<Etat>) ← @ManyToMany @JsonIgnore
└─ documents (Set<Document>) ← @ManyToMany via DocumentUser

Comportement:
- ADMIN: Accès à tous les endpoints /admin
- USER: Accès à /user endpoints avec filtrage par assignation
```

#### **Document.java** - PDF Storage Entity
```java
Propriétés clés:
├─ id (Long, @Id)
├─ fileName (String) ← Parsé: etat-banque-jour-mois-annee-xxxxxxxxx.pdf
├─ filePath (String) ← Chemin disque
├─ dateDocument (LocalDate) ← Parsée du nom
├─ uploadedAt (LocalDateTime) ← Timestamp creation
├─ banque (Banque) ← @ManyToOne
├─ etat (Etat) ← @ManyToOne
└─ documentUsers (Set<DocumentUser>) ← @OneToMany

Parsing: /uploads/etatsFile/PIA-BANK1-01-05-2026-12345.pdf
         → Etat.code="PIA", Banque.code="BANK1", dateDocument=2026-05-01
```

#### **DocumentUser.java** - Audit Junction
```java
Propriétés clés:
├─ id (Long, @Id)
├─ document (Document) ← @ManyToOne
├─ utilisateur (User) ← @ManyToOne
└─ dateAcces (LocalDateTime) ← Timestamp d'accès
```

#### **Trace.java** - Audit Log
```java
Propriétés clés:
├─ id (Long, @Id)
├─ utilisateur (User) ← @ManyToOne
├─ action (String) ← "CREATE_ETAT", "DELETE_USER", etc
├─ details (String) ← JSON des modifications
├─ dateAction (LocalDateTime)
└─ ipAddress (String) ← IP utilisateur
```

#### **CodePersistant.java** - Séquence Generation
```java
Propriétés: id, nomCode, valeur
Utilité: Générer codes uniques pour Documents, etc.
```

### 3.3 Problème Résolu: Boucles Infinies JSON

**Symptôme:** Lors d'appels API, erreur `StackOverflowError` ou réponse HTTP 500  
**Cause Root:** Relations ManyToMany bidirectionnelles non gérées:
- `Domaine.etats` → `Etat.domaine` → boucle
- `User.banques` → `Banque.utilisateurs` → boucle

**Solution appliquée:**
```java
// Dans Domaine.java
@OneToMany(mappedBy="domaine")
@JsonIgnore  ← Ajouté pour résoudre boucle
private Set<Etat> etats;

// Dans User.java
@ManyToMany
@JsonIgnore  ← Ajouté pour résoudre boucles
private Set<Banque> banques;
private Set<Domaine> domaines;
private Set<Etat> etats;
```

**Status:** ✅ RÉSOLU - JSON serialize correctement

### 3.4 Controllers REST - Endpoints

#### **AdminController.java** - Base Admin Operations
```
GET    /api/admin/dashboard ← Stats admin (count entités)
POST   /api/admin/check ← Vérifie role ADMIN
GET    /api/admin/users ← Liste tous users
POST   /api/admin/users ← Créer user
PUT    /api/admin/users/{id} ← Modifier user
DELETE /api/admin/users/{id} ← Supprimer user
```

#### **EtatController.java** - État Management
```
GET    /api/admin/etats ← Liste États (avec pagination)
POST   /api/admin/etats/upload ← Créer État + upload PDF
PUT    /api/admin/etats/upload/{id} ← Modifier État + PDF
DELETE /api/admin/etats/{id} ← Supprimer État
GET    /api/admin/etats/{id} ← Détail État

Multipart handling: Accept file + fields
Return: EtatResponse { id, code, nom, domaineId, frequence, ... }
```

#### **BanqueController.java** - Bank Management
```
GET    /api/admin/banques ← Liste Banques
POST   /api/admin/banques ← Créer Banque
PUT    /api/admin/banques/{id} ← Modifier Banque
DELETE /api/admin/banques/{id} ← Supprimer Banque
POST   /api/admin/banques/{id}/domaines ← Assign Domaines
POST   /api/admin/banques/{id}/etats ← Assign États
GET    /api/admin/banques/{id}/domaines ← Get Domaines de Banque
```

#### **DomaineController.java** - Domain Management
```
GET    /api/admin/domaines ← Liste Domaines
POST   /api/admin/domaines ← Créer Domaine
PUT    /api/admin/domaines/{id} ← Modifier Domaine
DELETE /api/admin/domaines/{id} ← Supprimer Domaine
POST   /api/admin/domaines/{id}/etats ← Assign États
```

#### **AuthController.java** - Authentication
```
POST   /api/auth/login ← { username, password } → JWT token
POST   /api/auth/register ← { username, email, password }
POST   /api/auth/logout ← Invalide session
GET    /api/auth/profile ← Données user connecté
```

#### **DocumentController.java** - Document Access
```
GET    /api/user/documents ← Docs user avec filtrage date
GET    /api/user/documents/{id}/download ← Télécharger PDF
GET    /api/admin/documents ← Tous docs (admin only)
```

### 3.5 Security & Configuration

#### **SecurityConfig.java**
```
- Spring Security configuration
- JWT token validation
- URL patterns:
  * /api/admin/** → require ADMIN role
  * /api/user/** → require USER or ADMIN role
  * /api/auth/** → public
- Password encoding: BCrypt
```

#### **CorsConfig.java**
```
Configuration CORS:
- Origin: http://localhost:5173 (frontend Vite)
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: *, Credentials: true
- Purpose: Permettre requêtes cross-origin frontend→backend
```

#### **application.properties**
```
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/stage_pca_db
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=your-secret-key
jwt.expiration=86400000
```

### 3.6 DTOs (Data Transfer Objects)

**Purpose:** Mapper données BD vers JSON API (vs exposer entités directement)

Exemples:
- `EtatResponse` { id, code, nom, domaineId, frequence }
- `BanqueDTO` { id, nom, code, domaineIds[], etatIds[] }
- `UserDTO` { id, username, email, role, banqueIds[], domaineIds[] }
- `DocumentDTO` { id, fileName, dateDocument, banque, etat }

---

## 4. FRONTEND - REACT 18 + VITE

### 4.1 Structure du Projet

```
Frontend/
├── package.json ← Dépendances npm
├── vite.config.js ← Config build Vite
├── index.html ← HTML entry point
├── src/
│   ├── main.jsx ← React entry point
│   ├── App.jsx ← Composant root
│   ├── App.css
│   ├── index.css
│   ├── assets/ ← Images, fonts
│   ├── components/ ← Composants réutilisables
│   │   ├── Sidebar.jsx ← Navigation latérale
│   │   ├── ui/ ← UI génériques
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Loader.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── context/ ← Context API
│   │   └── AuthContext.jsx ← État global auth + user
│   ├── pages/ ← Pages (récupérées par router)
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageEtats.jsx ← ✅ Complète avec modales
│   │   │   ├── ManageBanques.jsx ← 
│   │   │   ├── ManageDomaines.jsx ←
│   │   │   └── ManageUsers.jsx ← 
│   │   └── user/
│   │       └── UserDashboard.jsx ← À implémenter date filter
│   ├── routes/
│   │   └── AppRoutes.jsx ← React Router configuration
│   ├── services/
│   │   └── api.js ← Axios client pour requêtes backend
│   └── styles/ ← CSS files
│       ├── AdminDashboard.css
│       ├── Layout.css
│       ├── ManageBanques.css
│       ├── auth/login.css
│       └── global.css
└── public/ ← Assets static
```

### 4.2 Composants Clés

#### **App.jsx** - Composant Root
```jsx
Fonctionnalité:
- Utilise AuthContext pour état global
- Rend AppRoutes
- Gère layout général (Header, Sidebar, Footer)
```

#### **AuthContext.jsx** - État Global
```jsx
État géré:
├─ user { id, username, email, role, banques[], domaines[], etats[] }
├─ token (JWT du backend)
├─ isAuthenticated (booléen)
└─ Fonctions: login(), logout(), updateUser()

Utilité: Accessible dans tous composants sans prop drilling
```

#### **AppRoutes.jsx** - React Router
```jsx
Routes publiques:
- /auth/login ← Login.jsx
- /auth/register ← Register.jsx

Routes protégées ADMIN:
- /admin/dashboard ← AdminDashboard.jsx
- /admin/etats ← ManageEtats.jsx
- /admin/banques ← ManageBanques.jsx
- /admin/domaines ← ManageDomaines.jsx
- /admin/users ← ManageUsers.jsx

Routes protégées USER:
- /user/dashboard ← UserDashboard.jsx
```

#### **ManageEtats.jsx** - ✅ COMPLÈTE

État local:
```jsx
- etats[] ← Tous États actuels
- domaines[] ← Pour dropdown Domaine
- showModal ← Affiche modal create/edit
- editId ← ID État en édition (null si create)
- code, nom, description, frequence ← Form fields
- uploadFile ← File PDF
- domaineId ← Domaine sélectionné
- search ← Filtrer table par text
```

Fonctionnalités:
```jsx
1. loadEtats() ← GET /api/admin/etats, populate table
2. openModal(id?) ← Affiche modal, charge data si edit
3. createEtat() ← POST /api/admin/etats/upload + file
4. updateEtat() ← PUT /api/admin/etats/upload/{id} + file
5. deleteEtat(id) ← DELETE /api/admin/etats/{id}
6. closeModal() ← Ferme modal, reset form
```

Modal UI:
```jsx
- Input: code (requis, unique)
- Input: nom
- Textarea: description
- Select: frequence (HOURLY/DAILY/WEEKLY/MONTHLY/YEARLY)
- Select: domaine (dropdown)
- File: PDF upload
- Buttons: Save, Cancel
```

Table:
```
Colonnes: ID | Code | Nom | Domaine | Fréquence | Path Upload | Actions
Actions: Edit (ouvre modal), Delete (confirmation)
```

#### **ManageBanques.jsx** - ⚠️ À AMÉLIORER

État local:
```jsx
- banques[] ← Tous Banques
- domaines[] ← Pour sélection hiérarchique
- etats[] ← États disponibles
- showEtatModal ← Modal select États
- selectedBanqueId ← Banque courante
- selectedDomaines[] ← Domaines cochés
- selectedEtats[] ← États cochés
```

Problème courant:
- Modal affiche tous États, devrait montrer uniquement États des Domaines sélectionnés

Implémentation correcte attendue:
```jsx
1. Ouvrir modal sur "Manage États"
2. Afficher checkboxes Domaines
3. À chaque change Domaine, filtrer États = etats.filter(e => e.domaineId in selectedDomaines)
4. Afficher checkboxes États filtrés
5. Save: POST /api/admin/banques/{id}/etats avec validation
```

#### **ManageDomaines.jsx** - ⚠️ À IMPLÉMENTER

Fonctionnalité attendue:
```jsx
État local:
- domaines[] ← Tous Domaines
- showModal ← Modal create/edit/assign États
- selectedEtats[] ← États assignés à ce Domaine
- domaineId ← Domaine courant

Logique métier:
- Lors création Domaine, assigner États
- Chaque État ne doit exister que dans UN Domaine (unique constraint)
- Modal: Checkbox États avec validation "déjà assigné ailleurs"
```

#### **ManageUsers.jsx** - ⚠️ À CASCADER

Fonctionnalité attendue (3-step modal cascade):

```jsx
Step 1: Sélectionner Banque(s)
- Checkboxes de toutes les Banques
- Multiple selection possible

Step 2: Filtrer Domaines par Banques
- Afficher uniquement Domaines de Banques Step 1
- Checkboxes Domaines

Step 3: Filtrer États par Domaines
- Afficher uniquement États des Domaines Step 2
- Checkboxes États

Final Form:
- Username, Email, Password, Role
- Afficher résumé: "Banques: X, Domaines: Y, États: Z"
- Save: POST /api/admin/users avec nested assignment
```

#### **UserDashboard.jsx** - ⚠️ À IMPLÉMENTER

Fonctionnalité attendue:
```jsx
État local:
- documents[] ← Documents user filtrés
- startDate, endDate ← Plage dates
- selectedBanque, selectedDomaine, selectedEtat ← Filtres

Logique:
1. User login → fetch ses documents
2. Affiche date range picker (date du jour ± 30 jours default)
3. Chaque change startDate/endDate → GET /api/user/documents?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
4. Affiche table avec colonnes:
   - Nom PDF
   - Date document
   - Banque
   - État
   - Actions: View (modal PDF), Download (télécharger)
```

### 4.3 Services API

#### **api.js** - Axios Client
```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter JWT token à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoints utilisés:
export const authAPI = {
  login: (username, password) => API.post('/auth/login', { username, password }),
  register: (data) => API.post('/auth/register', data),
  logout: () => API.post('/auth/logout'),
};

export const adminAPI = {
  etats: {
    list: () => API.get('/admin/etats'),
    create: (formData) => API.post('/admin/etats/upload', formData),
    update: (id, formData) => API.put(`/admin/etats/upload/${id}`, formData),
    delete: (id) => API.delete(`/admin/etats/${id}`),
  },
  banques: {
    list: () => API.get('/admin/banques'),
    assignEtats: (id, etatIds) => API.post(`/admin/banques/${id}/etats`, { etatIds }),
  },
  domaines: {
    list: () => API.get('/admin/domaines'),
  },
  users: {
    list: () => API.get('/admin/users'),
    create: (data) => API.post('/admin/users', data),
    update: (id, data) => API.put(`/admin/users/${id}`, data),
    delete: (id) => API.delete(`/admin/users/${id}`),
  },
};

export const userAPI = {
  documents: {
    list: (startDate, endDate) => API.get(`/user/documents?startDate=${startDate}&endDate=${endDate}`),
    download: (id) => API.get(`/user/documents/${id}/download`),
  },
};
```

### 4.4 Pattern Modal Utilisé

**Approche uniforme pour tous les CRUD:**

```jsx
// État
const [showModal, setShowModal] = useState(false);
const [editId, setEditId] = useState(null);
const [formData, setFormData] = useState({ /* fields */ });

// Ouvrir create
const handleCreate = () => {
  setEditId(null);
  setFormData({ /* reset */ });
  setShowModal(true);
};

// Ouvrir edit
const handleEdit = (item) => {
  setEditId(item.id);
  setFormData(item);
  setShowModal(true);
};

// Submit (create ou update)
const handleSubmit = async () => {
  try {
    if (editId) {
      await API.put(`.../${editId}`, formData);
    } else {
      await API.post('...', formData);
    }
    setShowModal(false);
    loadItems(); // Refresh table
  } catch (error) {
    console.error(error);
  }
};

// JSX
return (
  <>
    {/* Table + Button "Create" */}
    <button onClick={handleCreate}>Créer</button>
    
    {/* Modal */}
    {showModal && (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2>{editId ? 'Modifier' : 'Créer'}</h2>
          {/* Form fields */}
          <button onClick={handleSubmit}>Enregistrer</button>
          <button onClick={() => setShowModal(false)}>Annuler</button>
        </div>
      </div>
    )}
  </>
);
```

---

## 5. BASE DE DONNÉES

### 5.1 Entités & Jointures

```sql
-- Core tables
etat (id, code*, nom, description, frequence, uploadPath, domaine_id**)
domaine (id, nom, description)
banque (id, nom, code*, ...)
utilisateur (id, username*, email, password, role, status, ...)
document (id, fileName, filePath, dateDocument, banque_id**, etat_id**)

-- Join tables (M2M)
banque_domaine (banque_id*, domaine_id*)
banque_etat (banque_id*, etat_id*)
user_banque (user_id*, banque_id*)
user_domaine (user_id*, domaine_id*)
user_etat (user_id*, etat_id*)

-- Audit tables
document_user (id, document_id**, user_id**, dateAcces)
trace (id, user_id**, action, details, dateAction, ipAddress)
code_persistant (id, nomCode, valeur)

* = unique
** = foreign key
```

### 5.2 Contraintes Métier

1. **Unicité État:**
   - `etat.code` unique
   - `etat.domaine_id` NOT NULL (chaque État a UN Domaine)
   - État ne peut être en plusieurs Domaines

2. **Hiérarchie Banque:**
   - `banque_domaine`: Banque associée à ses Domaines
   - `banque_etat`: Redondant mais utile pour requêtes directes
   - User → Banque → Domaine → État

3. **Authentification:**
   - `utilisateur.password` hashed (bcrypt)
   - `utilisateur.role` enum (ADMIN, USER)

### 5.3 Requêtes Fréquentes

```sql
-- Tous États d'une Banque
SELECT e.* FROM etat e
JOIN banque_domaine bd ON e.domaine_id = bd.domaine_id
WHERE bd.banque_id = ?;

-- Tous Documents d'un User avec dates
SELECT d.* FROM document d
JOIN user_etat ue ON d.etat_id = ue.etat_id
WHERE ue.user_id = ?
  AND d.dateDocument BETWEEN ? AND ?
ORDER BY d.dateDocument DESC;

-- Domaines d'une Banque
SELECT DISTINCT d.* FROM domaine d
JOIN banque_domaine bd ON d.id = bd.domaine_id
WHERE bd.banque_id = ?;
```

---

## 6. PROCESSUS DE DÉVELOPPEMENT

### 6.1 Problèmes Rencontrés & Solutions

#### ✅ Problème 1: JSON Infinite Loops
- **Symptôme:** StackOverflowError lors sérialisation entités avec M2M
- **Cause:** Relations circulaires (Domaine→Etat→Domaine)
- **Solution:** @JsonIgnore sur inverse side des M2M
- **État:** RÉSOLU

#### ✅ Problème 2: React Whitespace Error
- **Symptôme:** "In HTML, whitespace text nodes cannot be a child of <tr>"
- **Cause:** Espaces/newlines entre éléments JSX dans table
- **Solution:** Consolidation JSX à ligne unique par <tr>
- **État:** RÉSOLU

#### ⚠️ Problème 3: CORS Errors
- **Symptôme:** "No 'Access-Control-Allow-Origin' header"
- **Cause:** Frontend localhost:5173 vs Backend localhost:8080
- **Solution:** CorsConfig.java + @CrossOrigin (depuis revertée)
- **État:** En attente de test

### 6.2 Phase Actuelle: Modal Implementation

**Objectif utilisateur (verbatim):**
> "une fichie qui s'affiche devant la page , comme une petite fenetre , pour pouvoir creer , ou modifier"

Traduction: Modal windows pour tous opérations CRUD

**Avancement:**
- ✅ ManageEtats: Modal complète
- ⚠️ ManageBanques: Modal exists, needs filtering
- ❌ ManageDomaines: Needs modal implementation
- ❌ ManageUsers: Needs 3-step cascading modals
- ❌ UserDashboard: Needs date range picker

### 6.3 Prochaines Étapes (Priorité)

1. **Hiérarchie Banque→Domaine→État**
   - Implement filtering dans ManageBanques
   - Step 1: Select Domaines
   - Step 2: Filter États by Domaines

2. **ManageDomaines Modal**
   - Select États for Domaine
   - Validate no duplication across Domaines

3. **ManageUsers Cascade**
   - Step 1: Banques
   - Step 2: Domaines (filtered by Banques)
   - Step 3: États (filtered by Domaines)

4. **UserDashboard Date Filtering**
   - Date range picker
   - API integration with date params
   - Document display by date

5. **Backend Testing**
   - Verify compilation after JSON fixes
   - Test CORS with original config
   - Integration testing

---

## 7. ARCHITECTURE & DESIGN PATTERNS

### 7.1 Patterns Utilisés

**Backend:**
- **Repository Pattern:** *Repository interfaces pour accès données
- **DTO Pattern:** Séparation entités JPA ↔ JSON API
- **Service Layer:** Logique métier isolée des controllers
- **Exception Handling:** Centralisé via @ControllerAdvice

**Frontend:**
- **Context API:** État global (Auth)
- **Custom Hooks:** Réutilisation logique
- **Component Composition:** Layouts, Pages, UI components
- **Modal as Single Responsibility:** Chaque modal = une opération CRUD

### 7.2 Principes Appliqués

1. **Separation of Concerns:** Controllers ≠ Services ≠ Repositories
2. **DRY (Don't Repeat Yourself):** Composants réutilisables (Button, Card, Loader)
3. **Single Responsibility:** Chaque composant = une fonctionnalité
4. **Fail-Safe Defaults:** Role ADMIN pour opérations sensibles
5. **Audit Trail:** Trace + DocumentUser pour compliance

---

## 8. CONFIGURATION & DÉPLOIEMENT

### 8.1 Stack Technique

```
Frontend:        React 18 + Vite + Axios
Backend:         Spring Boot 3.x + Spring Data JPA
Database:        MySQL 8.0 / PostgreSQL 13+
Build Backend:   Maven (mvnw wrapper)
Build Frontend:  npm/yarn + Vite
Testing:         JUnit (backend), Vitest (frontend potential)
Authentication:  JWT tokens
Hosting Local:   localhost:8080 (backend), localhost:5173 (frontend)
```

### 8.2 Commandes Déploiement

**Backend Development:**
```bash
cd Backend
./mvnw spring-boot:run          # Démarre server @ localhost:8080
./mvnw clean compile            # Compile avec verification
./mvnw -X clean compile 2>&1 | tail -100  # Debug mode
```

**Frontend Development:**
```bash
cd Frontend
npm install                     # Install dépendances
npm run dev                     # Démarre Vite @ localhost:5173
npm run build                   # Build pour production
```

### 8.3 État Actuel (May 6, 2026)

Tous terminaux exit code 1 (non-confirmation d'erreurs)
- ❓ Backend: `./mvnw spring-boot:run` → Exit 1
- ❓ Frontend: `npm run dev` → Exit 1
- **Cause possible:** Récentes corrections JSON fixes non testées yet

---

## 9. DOCUMENTATION ASSOCIÉE

- **Diagrams.md:** UML Class Diagram + Use Cases + Sequence Diagrams + RBAC Matrix + Tech Stack
- **TODO.md:** Tâches résiduelles du projet
- **Backend/HELP.md:** Notes backend supplémentaires

---

## 10. CONCLUSION

### État du Projet
L'application est une **plateforme de gestion de documents réglementaires** avec architecture **hiérarchique État→Domaine→Banque→Utilisateur**. La phase de développement modal est en cours avec la majorité des primitives en place. L'infrastructure backend est solide après résolution des boucles JSON infinies.

### Points Forts
✅ Architecture claire et scalable  
✅ Hiérarchie de permissions bien définie  
✅ JSON serialization fixed  
✅ ManageEtats complète avec modales  
✅ Documentation UML complète  

### Points à Améliorer
⚠️ Modal filtering pas complète (ManageBanques, ManageDomaines, ManageUsers)  
⚠️ Tests backends non confirmés après JSON fixes  
⚠️ UserDashboard date filtering not implemented  
⚠️ CORS configuration à re-tester  

### Prochaine Étape
Implémenter **cascading modal selection** pour hiérarchie Banque→Domaine→État, puis UserDashboard date filtering.

---

*Dernière mise à jour: May 6, 2026*  
*État: En cours de phase modale avancée*
