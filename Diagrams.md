# 📊 Diagrammes UML - Système de Gestion d'États Réglementaires

## 1️⃣ Diagramme de Classe

```mermaid
classDiagram

    class User {
        - id: Long
        - username: String
        - fullName: String
        - email: String
        - password: String
        - role: Role (ADMIN/USER)
        - status: Status (ACTIVE/INACTIVE)
        - createdAt: LocalDateTime
        + getId(): Long
        + getUsername(): String
        + getFullName(): String
        + getEmail(): String
        + getPassword(): String
        + getRole(): Role
        + getStatus(): Status
        + getCreatedAt(): LocalDateTime
        + getBanques(): Set~Banque~
        + getDomaines(): Set~Domaine~
        + getEtats(): Set~Etat~
        + setPassword(pw: String): void
        + addBanque(b: Banque): void
        + removeBanque(b: Banque): void
        + addDomaine(d: Domaine): void
        + removeDomaine(d: Domaine): void
        + addEtat(e: Etat): void
        + removeEtat(e: Etat): void
    }

    class Banque {
        - id: Long
        - name: String
        + getId(): Long
        + getName(): String
        + setName(n: String): void
        + getDomaines(): Set~Domaine~
        + addDomaine(d: Domaine): void
        + removeDomaine(d: Domaine): void
        + getEtats(): Set~Etat~
        + addEtat(e: Etat): void
        + removeEtat(e: Etat): void
        + getUsers(): Set~User~
        + addUser(u: User): void
        + removeUser(u: User): void
    }

    class Domaine {
        - id: Long
        - name: String
        + getId(): Long
        + getName(): String
        + setName(n: String): void
        + getBanques(): Set~Banque~
        + addBanque(b: Banque): void
        + removeBanque(b: Banque): void
        + getEtats(): Set~Etat~
        + addEtat(e: Etat): void
        + removeEtat(e: Etat): void
        + getUsers(): Set~User~
        + addUser(u: User): void
        + removeUser(u: User): void
    }

    class Etat {
        - id: Long
        - code: String (unique)
        - nom: String
        - description: String
        - frequence: String (HOURLY/DAILY/WEEKLY/MONTHLY/YEARLY)
        - uploadPath: String
        + getId(): Long
        + getCode(): String
        + getNom(): String
        + getDescription(): String
        + getFrequence(): String
        + getUploadPath(): String
        + getDomaine(): Domaine
        + setDomaine(d: Domaine): void
        + getUsers(): Set~User~
        + addUser(u: User): void
        + removeUser(u: User): void
    }

    class Document {
        - id: Long
        - fileName: String
        - filePath: String
        - dateDocument: LocalDate
        - uploadedAt: LocalDateTime
        + getId(): Long
        + getFileName(): String
        + setFileName(n: String): void
        + getFilePath(): String
        + setFilePath(p: String): void
        + getDateDocument(): LocalDate
        + setDateDocument(d: LocalDate): void
        + getUploadedAt(): LocalDateTime
        + setUploadedAt(dt: LocalDateTime): void
        + getEtat(): Etat
        + setEtat(e: Etat): void
    }

    class DocumentUser {
        - id: Long
        - viewed: Boolean
        - viewedAt: LocalDateTime
        - assignedAt: LocalDateTime
        + getId(): Long
        + isViewed(): Boolean
        + setViewed(v: Boolean): void
        + getViewedAt(): LocalDateTime
        + setViewedAt(dt: LocalDateTime): void
        + getAssignedAt(): LocalDateTime
        + setAssignedAt(dt: LocalDateTime): void
        + getUser(): User
        + setUser(u: User): void
        + getDocument(): Document
        + setDocument(d: Document): void
    }

    class Trace {
        - id: Long
        - action: String (VIEW, DOWNLOAD)
        - actionDate: LocalDateTime
        + getId(): Long
        + getAction(): String
        + setAction(a: String): void
        + getActionDate(): LocalDateTime
        + setActionDate(dt: LocalDateTime): void
        + getUser(): User
        + setUser(u: User): void
        + getDocument(): Document
        + setDocument(d: Document): void
    }

    User "*" -- "*" Banque : banques
    User "*" -- "*" Domaine : domaines
    User "*" -- "*" Etat : etats
    Banque "*" -- "*" Domaine : domaines
    Banque "*" -- "*" Etat : etats
    Domaine "1" -- "*" Etat : etats
    Document "*" -- "1" Etat : etat
    DocumentUser "*" -- "1" User : user
    DocumentUser "*" -- "1" Document : document
    Trace "*" -- "1" User : user
    Trace "*" -- "1" Document : document
```

---

## 2️⃣ Diagramme des Use Cases

```mermaid
graph TD
    subgraph Admin["👨‍💼 ADMIN"]
        A1["Créer États"]
        A2["Créer Domaines"]
        A3["Assigner États à Domaines"]
        A4["Créer Banques"]
        A5["Assigner Domaines à Banques"]
        A6["Assigner États à Banques"]
        A7["Créer Utilisateurs"]
        A8["Assigner Banques à Utilisateurs"]
        A9["Assigner Domaines à Utilisateurs"]
        A10["Assigner États à Utilisateurs"]
    end

    subgraph User["👤 USER"]
        U1["Voir Documents"]
        U2["Filtrer par Date"]
        U3["Télécharger Document"]
        U4["Marquer comme Vu"]
    end

    subgraph System["🤖 SYSTÈME"]
        S1["Recevoir PDF du Serveur"]
        S2["Parser Nom de Fichier"]
        S3["Indexer dans État/Banque"]
        S4["Enregistrer Document"]
    end

    subgraph Audit["📋 AUDIT"]
        T1["Tracer Actions"]
        T2["Enregistrer Vue/Téléchargement"]
    end

    style Admin fill:#e1f5ff
    style User fill:#f3e5f5
    style System fill:#e8f5e9
    style Audit fill:#fff3e0
```

---

## 3️⃣ Diagramme de Séquence - Création d'État

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant Frontend as 🌐 Frontend
    participant Backend as 🔙 Backend
    participant DB as 💾 Database

    Admin->>Frontend: Clique "Créer État"
    Frontend->>Frontend: Affiche Modal
    Admin->>Frontend: Remplit formulaire (Code, Nom, Domaine)
    Frontend->>Backend: POST /api/admin/etats/upload
    Backend->>Backend: Valide données
    Backend->>DB: INSERT INTO etats
    DB-->>Backend: Etat créé
    Backend-->>Frontend: 200 OK + Etat
    Frontend->>Frontend: Recharge liste
    Frontend-->>Admin: État ajouté ✅
```

---

## 4️⃣ Diagramme de Séquence - Affectation Banque → Domaines → États

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant Frontend as 🌐 Frontend
    participant Backend as 🔙 Backend
    participant DB as 💾 Database

    Admin->>Frontend: Clique "Créer Banque"
    Frontend->>Frontend: Affiche Modal

    Admin->>Frontend: Rentre Nom Banque
    Frontend->>Backend: POST /api/admin/banques
    Backend->>DB: INSERT INTO banques
    DB-->>Backend: Banque créée
    Backend-->>Frontend: Banque ✅

    Frontend->>Frontend: Affiche Modal Domaines
    Admin->>Frontend: Sélectionne Domaines
    Frontend->>Backend: PUT /api/admin/banques/{id}/domaines
    Backend->>Backend: Valide Domaines
    Backend->>DB: UPDATE banque_domaine JOIN TABLE
    DB-->>Backend: OK

    Frontend->>Frontend: Affiche Modal États
    Admin->>Frontend: Sélectionne États des Domaines choisis
    Frontend->>Backend: PUT /api/admin/banques/{id}/etats
    Backend->>DB: UPDATE banque_etat JOIN TABLE
    DB-->>Backend: OK
    Backend-->>Frontend: 200 OK
    Frontend-->>Admin: Banque configurée ✅
```

---

## 5️⃣ Diagramme de Séquence - Création Utilisateur avec Permissions

```mermaid
sequenceDiagram
    participant Admin as 👨‍💼 Admin
    participant Frontend as 🌐 Frontend
    participant Backend as 🔙 Backend
    participant DB as 💾 Database

    Admin->>Frontend: Clique "Créer Utilisateur"
    Frontend->>Frontend: Affiche Modal Utilisateur

    Admin->>Frontend: Remplit Username, Email, Mot de passe
    Frontend->>Frontend: Affiche Liste Banques
    Admin->>Frontend: Sélectionne Banque(s)

    Frontend->>Frontend: Affiche Liste Domaines de Banque
    Admin->>Frontend: Sélectionne Domaine(s)

    Frontend->>Frontend: Affiche Liste États de Domaine
    Admin->>Frontend: Sélectionne État(s)

    Admin->>Frontend: Clique "Créer"
    Frontend->>Backend: POST /api/admin/users
    Backend->>Backend: Valide toutes données
    Backend->>DB: INSERT INTO users
    DB-->>Backend: User créé

    Backend->>DB: INSERT INTO user_banque (JOIN TABLE)
    Backend->>DB: INSERT INTO user_domaine (JOIN TABLE)
    Backend->>DB: INSERT INTO user_etat (JOIN TABLE)
    DB-->>Backend: Toutes liaisons créées ✅

    Backend-->>Frontend: 200 OK + User
    Frontend-->>Admin: Utilisateur créé avec permissions ✅
```

---

## 6️⃣ Diagramme de Séquence - User View Documents (Filtré par Date)

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Frontend as 🌐 Frontend
    participant Backend as 🔙 Backend
    participant DB as 💾 Database

    User->>Frontend: Accède UserDashboard
    Frontend->>Backend: GET /api/user/documents?startDate=X&endDate=Y
    Backend->>Backend: Récupère User actuel
    Backend->>DB: SELECT documents WHERE<br/>etat_id IN (user.etats)<br/>AND date BETWEEN X AND Y
    DB-->>Backend: Liste Documents filtrés
    Backend-->>Frontend: 200 OK + Documents
    Frontend->>Frontend: Affiche Documents par date

    User->>Frontend: Clique "Voir Document"
    Frontend->>Frontend: Ouvre PDF (e.target.uploadPath)
    Frontend-->>User: PDF visualisé 👁️

    Frontend->>Backend: POST /api/user/documents/{id}/view
    Backend->>Backend: Récupère User actuel
    Backend->>DB: INSERT INTO document_user (viewed=true)
    Backend->>DB: INSERT INTO traces (action='VIEW')
    DB-->>Backend: OK
    Backend-->>Frontend: 200 OK

    User->>Frontend: Clique "Télécharger"
    Frontend->>Backend: POST /api/user/documents/{id}/download
    Backend->>DB: INSERT INTO traces (action='DOWNLOAD')
    Frontend-->>User: Fichier téléchargé 📥
```

---

## 7️⃣ Diagramme de Séquence - Réception PDF du Serveur Externe

```mermaid
sequenceDiagram
    participant Server as 🖥️ Serveur Externe
    participant System as 🤖 Upload Service
    participant Backend as 🔙 Backend
    participant DB as 💾 Database

    Server->>System: Dépose PDF<br/>502-bcp-04-05-2026-etat..pdf
    System->>System: Parse nom
    System->>System: Extrait: Code=502, Banque=BCP, Date=04-05-2026

    System->>Backend: POST /api/admin/etats/upload<br/>(fileName, date, code)
    Backend->>DB: SELECT etat WHERE code='502'
    DB-->>Backend: Etat trouvé + Domaine/Banque

    Backend->>System: OK, accepté
    System->>System: Copie PDF dans /etatsFile/

    Backend->>DB: INSERT INTO documents<br/>(fileName, filePath, etat_id, banque_id, dateDocument)
    DB-->>Backend: Document enregistré

    Backend->>DB: SELECT users WHERE<br/>banque_id=X AND etat_id IN (...)
    DB-->>Backend: Utilisateurs destinataires

    Backend->>DB: INSERT INTO document_user<br/>(user_id, document_id, assigned_at)
    DB-->>Backend: Assignations créées

    Backend->>System: 200 OK - Document traité ✅
    System-->>Server: Confirmation
```

---

## 8️⃣ Flux Global (Swimlanes)

```mermaid
graph LR
    A["📋 Admin<br/>Configure"] -->|1. Crée États| B["🔴 Etats"]
    B -->|2. Groupe en| C["🟡 Domaines"]
    C -->|3. Assigne à| D["🟢 Banques"]
    D -->|4. Crée Users| E["👤 Utilisateurs"]
    E -->|5. Reçoit PDFs| F["📄 Documents"]
    F -->|6. Consulte par date| G["👁️ Visualise"]
    G -->|7. Trace actions| H["📊 Audit Logs"]

    style A fill:#e1f5ff
    style B fill:#ffe0b2
    style C fill:#fff9c4
    style D fill:#c8e6c9
    style E fill:#f3e5f5
    style F fill:#ffccbc
    style G fill:#b3e5fc
    style H fill:#fff3e0
```

---

## 9️⃣ Matrice d'Accès (RBAC)

| Fonction | Admin | User | Système |
|----------|-------|------|---------|
| Créer État | ✅ | ❌ | ❌ |
| Créer Domaine | ✅ | ❌ | ❌ |
| Créer Banque | ✅ | ❌ | ❌ |
| Assigner État→Domaine | ✅ | ❌ | ❌ |
| Assigner Domaine→Banque | ✅ | ❌ | ❌ |
| Créer Utilisateur | ✅ | ❌ | ❌ |
| Voir Documents (filtrés) | ❌ | ✅ | ❌ |
| Filtrer par Date | ❌ | ✅ | ❌ |
| Télécharger Documents | ❌ | ✅ | ❌ |
| Upload PDFs | ❌ | ❌ | ✅ |
| Voir Audit Logs | ✅ | ❌ | ❌ |

---

## 🔟 Technologies Stack

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  - React 18 + Vite                                      │
│  - React Router (Admin/User routes)                     │
│  - Modal Forms pour CRUD                                │
│  - API Service (Axios)                                  │
└─────────────────────────────────────────────────────────┘
                          ↕ REST API
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot)                   │
│  - Spring Web (REST Controllers)                        │
│  - Spring Data JPA (Persistence)                        │
│  - Spring Security (Auth/RBAC)                          │
│  - Multipart File Upload                               │
└─────────────────────────────────────────────────────────┘
                          ↕ SQL
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL/PostgreSQL)            │
│  - users, banques, domaines, etats (Core)              │
│  - documents, document_user, traces (Audit)            │
│  - user_banque, user_domaine, user_etat (M2M)          │
│  - banque_domaine, banque_etat (M2M)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📌 Points Clés de l'Architecture

✅ **Hiérarchie stricte**: État → Domaine → Banque → Utilisateur
✅ **Permissions granulaires**: Admin défini exactement ce que chaque User voit
✅ **Traçabilité complète**: Audit de toutes actions (view, download)
✅ **Gestion de fichiers**: Upload PDF avec parsing du nom
✅ **Filtrage par date**: Users voient documents selon période sélectionnée
✅ **JSON Loop-free**: `@JsonIgnore` sur relations inverses
✅ **Séparation des rôles**: Admin ≠ User (permissions strictes)
