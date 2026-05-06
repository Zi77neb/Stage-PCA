# NEXT PHASE: User Side Implementation - Complete Documentation

**Date:** May 6, 2026  
**Phase:** User-facing document distribution & traceability system  
**Status:** Planning → Implementation

---

## 1. FLUX GLOBAL PDF - RÉCEPTION À VISUALISATION

### 1.1 Étapes du Processus Complet

```
┌─────────────────────────────────────────────────────────────────┐
│ SYSTÈME EXTERNE (SOURCE)                                        │
├─────────────────────────────────────────────────────────────────┤
│ Génère Document: "502-04-04-2025-etatdeverxxxxxx.xlsx"        │
│ (PDF, Excel, CSV, TXT, ou autre)                               │
│ Envoie vers: incoming/ folder ou API                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND - FILE WATCHER & PARSER                                 │
├─────────────────────────────────────────────────────────────────┤
│ 1. Détecte nouveau fichier dans incoming/                      │
│ 2. Parse nom: extrait code État (502), date (04-04)            │
│ 3. Requête BD: cherche État.code=502 → État.domaine            │
│ 4. Valide: État existe, pas erreur parsing                      │
│ 5. Sauvegarde: fichier → uploads/documents/ (tout type)        │
│ 6. Enregistre: Document entity dans BD                         │
│ 7. Associe: aux Users via User.banques, User.domaines,User.etats│
│ 8. Trace: action=UPLOAD_RECEIVED, dateAction, fichier          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE - STORAGE & ASSOCIATIONS                               │
├─────────────────────────────────────────────────────────────────┤
│ Document:                                                       │
│   id, fileName, filePath, dateDocument, etat_id                 │
│   (Banque associée via Etat → Domaine → Banque)                 │
│                                                                 │
│ DocumentUser (association):                                     │
│   user_id, document_id, dateAcces (NULL until viewed)           │
│                                                                 │
│ Trace (audit):                                                  │
│   user_id, action=UPLOAD_RECEIVED, details, dateAction         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND - USER DASHBOARD                                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. User login                                                   │
│ 2. Dashboard affiche: Documents filtrés par date                │
│    Default: aujourd'hui ± 30 jours                              │
│ 3. Colonnes: Nom | Date | Banque | État | Actions              │
│ 4. Actions: View (modal PDF preview) | Download (.pdf)         │
│ 5. Filters: Date range picker, Banque, Domaine, État           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ TRACE - AUDIT TRAIL                                             │
├─────────────────────────────────────────────────────────────────┤
│ View:   Trace.action = DOCUMENT_VIEWED, dateAction = now()      │
│ Download: Trace.action = DOCUMENT_DOWNLOADED, dateAction=now()  │
│ Admin Dashboard: Affiche tous les traces pour analytics         │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Noms de Fichiers & Parsing

**Format attendu:**
```
{etat-code}-{banque-code}-{jour}-{mois}-{annee}-{xxxx...}.pdf

Exemples:
502-bcp-04-04-2025-etatdeverxxxxxx.pdf
  ↓
  État.code = "502"
  Banque.code = "bcp"
  dateDocument = "2025-04-04"
  (xxxx... ignoré)

150-bnp-15-05-2026-dossierxxxxxxxxxxx.pdf
  ↓
  État.code = "150"
  Banque.code = "bnp"
  dateDocument = "2026-05-15"
```

**Regex de parsing:**
```regex
^([A-Z0-9]+)-([A-Z0-9]+)-(\d{2})-(\d{2})-(\d{4})-(.*)\.pdf$

Groupes:
1 = etat-code
2 = banque-code
3 = jour (01-31)
4 = mois (01-12)
5 = annee (YYYY)
6 = ignored (xxxxx...)
```

---

## 2. BACKEND - IMPLÉMENTATION CÔTÉ SERVEUR

### 2.1 File Watcher Service (Nouvelle Classe)

**Fichier:** `Backend/src/main/java/com/example/demo/service/FileWatcherService.java`

```java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class FileWatcherService {
  
  @Autowired private DocumentService documentService;
  @Autowired private EtatRepository etatRepository;
  @Autowired private BanqueRepository banqueRepository;
  
  private static final Path INCOMING_DIR = Paths.get("incoming/");
  private static final Path UPLOADS_DIR = Paths.get("uploads/documents/");
  private static final String FILENAME_PATTERN = 
    "^([A-Z0-9]+)-(\\d{2})-(\\d{2})-(\\d{4})-(.+)$";
  
  /**
   * Watcher s'exécute toutes les 5 secondes
   * Détecte nouveaux fichiers dans incoming/
   */
  @Scheduled(fixedRate = 5000)
  public void watchIncomingDirectory() {
    try {
      File incomingFolder = INCOMING_DIR.toFile();
      if (!incomingFolder.exists()) {
        incomingFolder.mkdirs();
        return;
      }
      
      File[] files = incomingFolder.listFiles((dir, name) -> 
        !name.startsWith(".") && !name.endsWith(".tmp")
      );
      
      if (files != null) {
        for (File file : files) {
          processFile(file);
        }
      }
    } catch (Exception e) {
      System.err.println("File watcher error: " + e.getMessage());
    }
  }
  
  /**
   * Traite un fichier PDF unique
   */
  private void processFile(File file) {
    try {
      String fileName = file.getName();
      
      // 1. Parse filename
      Pattern pattern = Pattern.compile(FILENAME_PATTERN, Pattern.CASE_INSENSITIVE);
      Matcher matcher = pattern.matcher(fileName);
      
      if (!matcher.matches()) {
        System.err.println("Invalid filename format: " + fileName);
        file.delete(); // Ou déplacer en error/
        return;
      }
      
      String etatCode = matcher.group(1).toUpperCase();
      String day = matcher.group(2);
      String month = matcher.group(3);
      String year = matcher.group(4);
      String restOfName = matcher.group(5);
      
      // 2. Convertir date
      String dateStr = year + "-" + month + "-" + day;
      LocalDate dateDocument = LocalDate.parse(dateStr, 
        DateTimeFormatter.ISO_DATE);
      
      // 3. Requête BD: chercher État
      Etat etat = etatRepository.findByCode(etatCode)
        .orElseThrow(() -> new RuntimeException("État non trouvé: " + etatCode));
      
      // 4. Validation: État existe (pas besoin de vérifier Banque)
      // État.domaine est automatiquement associé
      
      // 5. Copier fichier vers uploads/
      Path targetPath = UPLOADS_DIR.resolve(fileName);
      Files.createDirectories(UPLOADS_DIR);
      Files.copy(file.toPath(), targetPath, 
        StandardCopyOption.REPLACE_EXISTING);
      
      // 5. Enregistrer Document en BD
      Document document = new Document();
      document.setFileName(fileName); // Nom complet du système
      document.setFilePath(targetPath.toString());
      document.setDateDocument(dateDocument);
      document.setEtat(etat);
      // Pas de banque directe - accès via Etat → Domaine → Banques
      document.setUploadedAt(LocalDateTime.now());
      
      documentService.save(document);
      
      // 6. Associer aux Users
      associateUsersToDocument(document);
      
      // 7. Tracer
      traceService.log(null, "UPLOAD_RECEIVED", 
        "Document " + fileName + " processed", null);
      
      // 8. Supprimer fichier source
      file.delete();
      
      System.out.println("✅ Processed: " + fileName);
      
    } catch (Exception e) {
      System.err.println("❌ Error processing " + file.getName() + ": " + e.getMessage());
      // Optionnel: déplacer en dossier error/
    }
  }
  
  /**
   * Associe le Document aux Users autorisés
   * Logique: User a-t-il l'État dans ses États assignés?
   */
  private void associateUsersToDocument(Document document) {
    // Chercher tous les Users qui ont cet État
    Set<User> usersWithAccess = document.getEtat().getUtilisateurs();
    
    for (User user : usersWithAccess) {
      // Créer DocumentUser association
      DocumentUser docUser = new DocumentUser();
      docUser.setDocument(document);
      docUser.setUser(user);
      // dateAcces = NULL jusqu'à première consultation
      
      documentUserRepository.save(docUser);
    }
  }
}
```

### 2.2 Document Service (Nouvelles Méthodes)

**Fichier:** `Backend/src/main/java/com/example/demo/service/DocumentService.java`

```java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class DocumentService {
  
  @Autowired private DocumentRepository documentRepository;
  @Autowired private DocumentUserRepository documentUserRepository;
  @Autowired private TraceService traceService;
  @Autowired private UserRepository userRepository;
  
  /**
   * Get documents for current user within date range
   */
  public List<Document> getUserDocuments(Long userId, 
                                        LocalDate startDate, 
                                        LocalDate endDate) {
    return documentRepository.findByUserIdAndDateRange(userId, startDate, endDate);
  }
  
  /**
   * Get documents filtered by user + domaine + etat (pas banque)
   */
  public List<Document> getUserDocumentsFiltered(Long userId,
                                                 Long domaineId,
                                                 Long etatId,
                                                 LocalDate startDate,
                                                 LocalDate endDate) {
    return documentRepository.findByUserAndFilters(
      userId, domaineId, etatId, startDate, endDate
    );
  }
  
  /**
   * Save document (called by FileWatcherService)
   */
  public Document save(Document document) {
    return documentRepository.save(document);
  }
  
  /**
   * Record document view in Trace
   */
  public void recordView(Long userId, Long documentId) {
    Document doc = documentRepository.findById(documentId)
      .orElseThrow(() -> new RuntimeException("Document not found"));
    
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Mettre à jour dateAcces dans DocumentUser
    DocumentUser docUser = documentUserRepository
      .findByDocumentAndUser(doc, user)
      .orElseThrow(() -> new RuntimeException("Access denied"));
    
    docUser.setDateAcces(LocalDateTime.now());
    documentUserRepository.save(docUser);
    
    // Log trace
    traceService.log(user, "DOCUMENT_VIEWED", 
      "Viewed document: " + doc.getFileName(), null);
  }
  
  /**
   * Record document download
   */
  public void recordDownload(Long userId, Long documentId) {
    Document doc = documentRepository.findById(documentId)
      .orElseThrow(() -> new RuntimeException("Document not found"));
    
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Update dateAcces si NULL
    DocumentUser docUser = documentUserRepository
      .findByDocumentAndUser(doc, user)
      .orElseThrow(() -> new RuntimeException("Access denied"));
    
    if (docUser.getDateAcces() == null) {
      docUser.setDateAcces(LocalDateTime.now());
    }
    documentUserRepository.save(docUser);
    
    // Log trace
    traceService.log(user, "DOCUMENT_DOWNLOADED", 
      "Downloaded document: " + doc.getFileName(), null);
  }
}
```

### 2.3 Document Repository (Custom Queries)

**Fichier:** `Backend/src/main/java/com/example/demo/repository/DocumentRepository.java`

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
  
  /**
   * Documents pour un user dans une plage de dates
   */
  @Query("""
    SELECT DISTINCT d FROM Document d
    JOIN DocumentUser du ON d.id = du.document.id
    WHERE du.user.id = :userId
      AND d.dateDocument BETWEEN :startDate AND :endDate
    ORDER BY d.dateDocument DESC
  """)
  List<Document> findByUserIdAndDateRange(
    @Param("userId") Long userId,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate
  );
  
  /**
   * Avec filtres Domaine/État (pas de Banque directe)
   */
  @Query("""
    SELECT DISTINCT d FROM Document d
    JOIN DocumentUser du ON d.id = du.document.id
    WHERE du.user.id = :userId
      AND (CAST(:domaineId AS long) IS NULL OR d.etat.domaine.id = :domaineId)
      AND (CAST(:etatId AS long) IS NULL OR d.etat.id = :etatId)
      AND d.dateDocument BETWEEN :startDate AND :endDate
    ORDER BY d.dateDocument DESC
  """)
  List<Document> findByUserAndFilters(
    @Param("userId") Long userId,
    @Param("domaineId") Long domaineId,
    @Param("etatId") Long etatId,
    @Param("startDate") LocalDate startDate,
    @Param("endDate") LocalDate endDate
  );
  
  /**
   * Documents d'un État
   */
  List<Document> findByEtat(Etat etat);
}
```

### 2.4 DocumentUser Repository

**Fichier:** `Backend/src/main/java/com/example/demo/repository/DocumentUserRepository.java`

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DocumentUserRepository extends JpaRepository<DocumentUser, Long> {
  
  Optional<DocumentUser> findByDocumentAndUser(Document document, User user);
}
```

### 2.5 Document Controller (User Endpoints)

**Fichier:** `Backend/src/main/java/com/example/demo/controller/DocumentController.java`

```java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class DocumentController {
  
  @Autowired private DocumentService documentService;
  @Autowired private UserRepository userRepository;
  
  /**
   * GET /api/user/documents?startDate=2026-04-01&endDate=2026-05-06
   */
  @GetMapping("/documents")
  public ResponseEntity<?> getUserDocuments(
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
    Authentication authentication
  ) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    List<Document> documents = documentService.getUserDocuments(
      user.getId(), startDate, endDate
    );
    
    return ResponseEntity.ok(documents);
  }
  
  /**
   * GET /api/user/documents/filtered?domaineId=2&etatId=3&startDate=...&endDate=...
   */
  @GetMapping("/documents/filtered")
  public ResponseEntity<?> getFilteredDocuments(
    @RequestParam(required = false) Long domaineId,
    @RequestParam(required = false) Long etatId,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
    Authentication authentication
  ) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    List<Document> documents = documentService.getUserDocumentsFiltered(
      user.getId(), domaineId, etatId, startDate, endDate
    );
    
    return ResponseEntity.ok(documents);
  }
  
  /**
   * GET /api/user/documents/{id}/download
   * Supporte tous types: PDF, Excel, CSV, etc.
   */
  @GetMapping("/documents/{id}/download")
  public ResponseEntity<?> downloadDocument(
    @PathVariable Long id,
    Authentication authentication
  ) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    Document doc = documentRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Document not found"));
    
    documentService.recordDownload(user.getId(), id);
    
    // Retourner fichier: PDF, Excel, CSV, etc.
    // À implémenter: FileSystemResource + MediaType detection
    File file = new File(doc.getFilePath());
    return ResponseEntity
      .ok()
      .header("Content-Disposition", "attachment; filename=" + doc.getFileName())
      .body(new FileSystemResource(file));
  }
  
  /**
   * GET /api/user/documents/{id}/view
   * Record view (not download, just viewing)
   */
  @GetMapping("/documents/{id}/view")
  public ResponseEntity<?> viewDocument(
    @PathVariable Long id,
    Authentication authentication
  ) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    documentService.recordView(user.getId(), id);
    
    // Retourner file ou URL pour preview
    return ResponseEntity.ok().build();
  }
}
```

### 2.6 Document & DocumentUser Entities (Adjustments)

**Fichier:** `Backend/src/main/java/com/example/demo/model/entity/Document.java`

```java
package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "document")
public class Document {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @Column(nullable = false)
  private String fileName; // 502-bcp-04-04-2025-xxxxxx.pdf
  
  @Column(nullable = false)
  private String filePath; // /uploads/etatsFile/502-bcp-04-04-2025-xxxxxx.pdf
  
  @Column(nullable = false)
  private LocalDate dateDocument; // Parsée du filename
  
  @ManyToOne(optional = false)
  @JoinColumn(name = "etat_id")
  private Etat etat;
  // Banque: accès via Etat → Domaine → Banques (pour queries complexes si besoin)
  
  @Column(nullable = false, updatable = false)
  private LocalDateTime uploadedAt; // Timestamp creation
  
  @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
  @JsonIgnore
  private Set<DocumentUser> documentUsers;
  
  // Getters & Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  
  public String getFileName() { return fileName; }
  public void setFileName(String fileName) { this.fileName = fileName; }
  
  public String getFilePath() { return filePath; }
  public void setFilePath(String filePath) { this.filePath = filePath; }
  
  public LocalDate getDateDocument() { return dateDocument; }
  public void setDateDocument(LocalDate dateDocument) { this.dateDocument = dateDocument; }
  
  public Etat getEtat() { return etat; }
  public void setEtat(Etat etat) { this.etat = etat; }
  
  public LocalDateTime getUploadedAt() { return uploadedAt; }
  public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
```

**Fichier:** `Backend/src/main/java/com/example/demo/model/entity/DocumentUser.java`

```java
package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_user")
public class DocumentUser {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne(optional = false)
  @JoinColumn(name = "document_id")
  private Document document;
  
  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;
  
  @Column(name = "date_acces")
  private LocalDateTime dateAcces; // NULL jusqu'à première consultation
  
  // Getters & Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  
  public Document getDocument() { return document; }
  public void setDocument(Document document) { this.document = document; }
  
  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }
  
  public LocalDateTime getDateAcces() { return dateAcces; }
  public void setDateAcces(LocalDateTime dateAcces) { this.dateAcces = dateAcces; }
}
```

### 2.7 Trace Service (Audit)

**Fichier:** `Backend/src/main/java/com/example/demo/service/TraceService.java`

```java
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Service
public class TraceService {
  
  @Autowired private TraceRepository traceRepository;
  @Autowired private HttpServletRequest request;
  
  /**
   * Log an action to Trace table
   */
  public void log(User user, String action, String details, Long targetId) {
    Trace trace = new Trace();
    trace.setUser(user);
    trace.setAction(action); // UPLOAD_RECEIVED, DOCUMENT_VIEWED, DOCUMENT_DOWNLOADED
    trace.setDetails(details);
    trace.setDateAction(LocalDateTime.now());
    
    // Extraire IP
    String ipAddress = getClientIp();
    trace.setIpAddress(ipAddress);
    
    traceRepository.save(trace);
  }
  
  private String getClientIp() {
    String clientIp = request.getHeader("X-Forwarded-For");
    if (clientIp == null || clientIp.isEmpty()) {
      clientIp = request.getRemoteAddr();
    }
    return clientIp;
  }
}
```

---

## 3. FRONTEND - USER DASHBOARD IMPLEMENTATION

### 3.1 UserDashboard.jsx (Complete Component)

**Fichier:** `Frontend/src/pages/user/UserDashboard.jsx`

```jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import './UserDashboard.css';

export default function UserDashboard() {
  // Context
  const { user } = useContext(AuthContext);
  
  // State: Documents
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State: Filters
  const [startDate, setStartDate] = useState(getTodayMinus30());
  const [endDate, setEndDate] = useState(getToday());
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedEtat, setSelectedEtat] = useState(null);
  
  // State: Filter options
  const [domaines, setDomaines] = useState([]);
  const [etats, setEtats] = useState([]);
  
  // State: Preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  
  // Helper: get today
  function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  // Helper: get today - 30 days
  function getTodayMinus30() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }
  
  // Load initial data
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);
  
  // Load documents when filters change
  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [startDate, endDate, selectedDomaine, selectedEtat]);
  
  /**
   * Load user's domaines et etats
   */
  async function loadInitialData() {
    try {
      setLoading(true);
      
      // Get all domaines accessible to user
      const domainesRes = await API.get('/user/domaines');
      setDomaines(domainesRes.data);
      
      // Get all etats accessible to user
      const etatsRes = await API.get('/user/etats');
      setEtats(etatsRes.data);
      
      setError(null);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }
  
  /**
   * Load documents with filters
   */
  async function loadDocuments() {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(selectedDomaine && { domaineId: selectedDomaine }),
        ...(selectedEtat && { etatId: selectedEtat }),
      });
      
      const response = await API.get(`/user/documents?${params}`);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Erreur lors du chargement des documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }
  
  /**
   * Handle view/preview
   */
  async function handleView(doc) {
    try {
      await API.get(`/user/documents/${doc.id}/view`);
      setPreviewDoc(doc);
      setShowPreview(true);
    } catch (err) {
      console.error('Error viewing document:', err);
      alert('Erreur lors de l\'ouverture du document');
    }
  }
  
  /**
   * Handle download
   */
  async function handleDownload(doc) {
    try {
      await API.get(`/user/documents/${doc.id}/download`);
      // Browser should trigger download
      window.location.href = `${API.defaults.baseURL}/user/documents/${doc.id}/download`;
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('Erreur lors du téléchargement du document');
    }
  }
  
  /**
   * Reset filters
   */
  function handleResetFilters() {
    setStartDate(getTodayMinus30());
    setEndDate(getToday());
    setSelectedDomaine(null);
    setSelectedEtat(null);
  }
  
  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>📄 Mes Documents</h1>
        <p>Bienvenue, {user?.username}</p>
      </div>
      
      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Date de début:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Date de fin:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        {/* Banque removed - not used in filtering */}
        
        <div className="filter-group">
          <label>Domaine:</label>
          <select
            value={selectedDomaine || ''}
            onChange={(e) => setSelectedDomaine(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">-- Tous les domaines --</option>
            {domaines.map((d) => (
              <option key={d.id} value={d.id}>{d.nom}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>État:</label>
          <select
            value={selectedEtat || ''}
            onChange={(e) => setSelectedEtat(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">-- Tous les états --</option>
            {etats.map((e) => (
              <option key={e.id} value={e.id}>{e.nom} ({e.code})</option>
            ))}
          </select>
        </div>
        
        <button className="btn-reset" onClick={handleResetFilters}>
          🔄 Réinitialiser filtres
        </button>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Loading */}
      {loading && <div className="loader">Chargement...</div>}
      
      {/* Documents Table */}
      {!loading && documents.length > 0 && (
        <div className="documents-table-container">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Nom du fichier</th>
                <th>Date du document</th>
                <th>État</th>
                <th>Domaine</th>
                <th>Consulté le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.fileName}</td>
                  <td>{new Date(doc.dateDocument).toLocaleDateString('fr-FR')}</td>
                  <td>{doc.etat?.nom}</td>
                  <td>{doc.etat?.domaine?.nom}</td>
                  <td>{doc.dateAcces 
                    ? new Date(doc.dateAcces).toLocaleDateString('fr-FR')
                    : '-'}</td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleView(doc)}
                      title="Voir l'aperçu"
                    >
                      👁️ Voir
                    </button>
                    <button 
                      className="btn-download"
                      onClick={() => handleDownload(doc)}
                      title="Télécharger le PDF"
                    >
                      ⬇️ Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* No Documents */}
      {!loading && documents.length === 0 && (
        <div className="no-documents">
          📭 Aucun document trouvé pour cette période.
        </div>
      )}
      
      {/* Preview Modal */}
      {showPreview && previewDoc && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{previewDoc.fileName}</h2>
              <button className="close-btn" onClick={() => setShowPreview(false)}>✕</button>
            </div>
            <div className="modal-body">
              <iframe
                src={previewDoc.filePath}
                type="application/pdf"
                width="100%"
                height="600px"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="btn-download"
                onClick={() => handleDownload(previewDoc)}
              >
                ⬇️ Télécharger
              </button>
              <button 
                className="btn-close"
                onClick={() => setShowPreview(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3.2 UserDashboard.css

**Fichier:** `Frontend/src/pages/user/UserDashboard.css`

```css
.user-dashboard {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 5px 0 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

/* Filters Section */
.filters-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-reset {
  align-self: flex-end;
  padding: 8px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-reset:hover {
  background-color: #5568d3;
}

/* Error Message */
.error-message {
  background-color: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
}

/* Loader */
.loader {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #667eea;
}

/* Documents Table */
.documents-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.documents-table {
  width: 100%;
  border-collapse: collapse;
}

.documents-table thead {
  background-color: #f0f0f0;
}

.documents-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.documents-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.documents-table tbody tr:hover {
  background-color: #f9f9f9;
}

.documents-table .actions {
  display: flex;
  gap: 10px;
}

.btn-view,
.btn-download {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-view {
  background-color: #667eea;
  color: white;
}

.btn-view:hover {
  background-color: #5568d3;
  transform: scale(1.05);
}

.btn-download {
  background-color: #28a745;
  color: white;
}

.btn-download:hover {
  background-color: #218838;
  transform: scale(1.05);
}

/* No Documents */
.no-documents {
  background: white;
  padding: 60px 20px;
  text-align: center;
  border-radius: 8px;
  color: #999;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow: auto;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  justify-content: flex-end;
}

.btn-close {
  padding: 8px 20px;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-close:hover {
  background-color: #bbb;
}

/* Responsive */
@media (max-width: 768px) {
  .filters-section {
    grid-template-columns: 1fr;
  }
  
  .documents-table {
    font-size: 0.85rem;
  }
  
  .documents-table th,
  .documents-table td {
    padding: 8px 10px;
  }
  
  .modal {
    width: 95%;
  }
}
```

### 3.3 API Service - New Endpoints

**Fichier Update:** `Frontend/src/services/api.js`

```javascript
// Ajouter ces endpoints pour User:

export const userAPI = {
  documents: {
    list: (startDate, endDate, filters) => {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(filters.banqueId && { banqueId: filters.banqueId }),
        ...(filters.domaineId && { domaineId: filters.domaineId }),
        ...(filters.etatId && { etatId: filters.etatId }),
      });
      return API.get(`/user/documents?${params}`);
    },
    
    view: (documentId) => 
      API.get(`/user/documents/${documentId}/view`),
    
    download: (documentId) => 
      API.get(`/user/documents/${documentId}/download`),
  },
  
  banques: {
    list: () => API.get('/user/banques'),
  },
  
  domaines: {
    list: () => API.get('/user/domaines'),
  },
  
  etats: {
    list: () => API.get('/user/etats'),
  },
};
```

---

## 4. BACKEND CONTROLLERS - MISSING USER ENDPOINTS

### 4.1 User Info Endpoints

**Fichier:** `Backend/src/main/java/com/example/demo/controller/UserController.java` (Nouveau)

```java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
  
  @Autowired private UserRepository userRepository;
  
  /**
   * GET /api/user/banques
   * Get user's assigned banques
   */
  @GetMapping("/banques")
  public ResponseEntity<?> getUserBanques(Authentication authentication) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    return ResponseEntity.ok(user.getBanques());
  }
  
  /**
   * GET /api/user/domaines
   * Get user's assigned domaines
   */
  @GetMapping("/domaines")
  public ResponseEntity<?> getUserDomaines(Authentication authentication) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    return ResponseEntity.ok(user.getDomaines());
  }
  
  /**
   * GET /api/user/etats
   * Get user's assigned etats
   */
  @GetMapping("/etats")
  public ResponseEntity<?> getUserEtats(Authentication authentication) {
    User user = userRepository.findByUsername(authentication.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));
    
    return ResponseEntity.ok(user.getEtats());
  }
}
```

---

## 5. DATABASE SCHEMA UPDATES

### 5.1 New Tables

```sql
-- Document table (supports any file type: PDF, Excel, CSV, etc.)
CREATE TABLE document (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(500) NOT NULL,  -- Full name from system
  file_path VARCHAR(500) NOT NULL,  -- Disk path
  date_document DATE NOT NULL,      -- Parsed from filename
  etat_id BIGINT NOT NULL,          -- État only (no direct banque)
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (etat_id) REFERENCES etat(id),
  INDEX idx_date (date_document),
  INDEX idx_etat (etat_id),
  INDEX idx_file_name (file_name)
);

-- DocumentUser association
CREATE TABLE document_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  document_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  date_acces TIMESTAMP NULL,
  FOREIGN KEY (document_id) REFERENCES document(id),
  FOREIGN KEY (user_id) REFERENCES utilisateur(id),
  UNIQUE KEY unique_doc_user (document_id, user_id)
);

-- Trace audit
CREATE TABLE trace (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  action VARCHAR(50) NOT NULL,
  details TEXT,
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES utilisateur(id),
  INDEX idx_action (action),
  INDEX idx_date (date_action),
  INDEX idx_user (user_id)
);
```

---

## 6. SIMULATION DU SYSTÈME EXTERNE (TESTING)

### 6.1 Manual File Upload (Pour tester)

**Processus de test:**

1. Créer un fichier de test (PDF, Excel, CSV, etc.):
   ```bash
   # Windows PowerShell
   echo "Test Content" > "502-04-04-2025-etatdeverxxxxxx.pdf"
   # ou Excel
   echo "Test" > "502-04-04-2025-rapport.xlsx"
   # ou CSV
   echo "Test" > "502-04-04-2025-data.csv"
   ```

2. Placer dans dossier `incoming/`:
   ```bash
   mkdir incoming
   copy "502-04-04-2025-*.pdf" incoming/
   copy "502-04-04-2025-*.xlsx" incoming/
   ```

3. File watcher détecte (toutes les 5 secondes):
   - Parse filename (État, date)
   - Cherche État 502 dans BD
   - Copie dans uploads/documents/ (tout type)
   - Crée Document entry
   - Associe aux Users qui ont cet État
   - Log Trace

4. Utilisateur voit le document dans Dashboard

### 6.2 API Testing (Curl Commands)

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass123"}'
# → Reçoit token JWT

# Get user's documents (derniers 30 jours)
curl -X GET 'http://localhost:8080/api/user/documents?startDate=2026-04-06&endDate=2026-05-06' \
  -H "Authorization: Bearer {token}"

# Get user's documents with filters (domaine + etat)
curl -X GET 'http://localhost:8080/api/user/documents/filtered?domaineId=1&etatId=5&startDate=2026-04-06&endDate=2026-05-06' \
  -H "Authorization: Bearer {token}"

# View document (record trace)
curl -X GET http://localhost:8080/api/user/documents/1/view \
  -H "Authorization: Bearer {token}"

# Download document
curl -X GET http://localhost:8080/api/user/documents/1/download \
  -H "Authorization: Bearer {token}"
```

---

## 7. DASHBOARD ADMIN - ANALYTICS

### 7.1 AdminController Enhancement

```java
/**
 * GET /api/admin/dashboard/stats
 * Get system statistics
 */
@GetMapping("/dashboard/stats")
public ResponseEntity<?> getStats() {
  Map<String, Object> stats = new HashMap<>();
  
  stats.put("totalEtats", etatRepository.count());
  stats.put("totalDomaines", domaineRepository.count());
  stats.put("totalBanques", banqueRepository.count());
  stats.put("totalUsers", userRepository.count());
  stats.put("totalDocuments", documentRepository.count());
  
  // Documents par jour (derniers 7 jours)
  List<Object[]> docsPerDay = documentRepository.getDocumentsPerDay();
  stats.put("documentsPerDay", docsPerDay);
  
  // Documents par banque
  List<Object[]> docsByBanque = documentRepository.getDocumentsByBanque();
  stats.put("documentsByBanque", docsByBanque);
  
  // Top users
  List<Object[]> topUsers = traceRepository.getTopViewers();
  stats.put("topViewers", topUsers);
  
  return ResponseEntity.ok(stats);
}

/**
 * GET /api/admin/traces
 * Get all audit traces
 */
@GetMapping("/traces")
public ResponseEntity<?> getTraces(
  @RequestParam(required = false) String action,
  @RequestParam(required = false) Long userId
) {
  if (action != null && userId != null) {
    return ResponseEntity.ok(
      traceRepository.findByActionAndUser(action, userId)
    );
  } else if (action != null) {
    return ResponseEntity.ok(traceRepository.findByAction(action));
  } else if (userId != null) {
    return ResponseEntity.ok(traceRepository.findByUser(userId));
  }
  
  return ResponseEntity.ok(traceRepository.findAll());
}
```

---

## 8. CHECKLIST IMPLÉMENTATION

### Phase 1: Backend (Priorité 1)
- [ ] FileWatcherService: Détection fichiers incoming/
- [ ] FileWatcherService: Parsing nom fichier
- [ ] FileWatcherService: Validation État/Banque
- [ ] FileWatcherService: Copie vers uploads/
- [ ] Document entity & DocumentUser entity
- [ ] DocumentRepository: Custom queries
- [ ] DocumentService: CRUD + association
- [ ] DocumentController: /api/user/documents endpoints
- [ ] TraceService & TraceRepository
- [ ] UserController: /api/user/banques, /api/user/domaines, /api/user/etats
- [ ] Admin endpoint: /api/admin/traces

### Phase 2: Frontend (Priorité 2)
- [ ] UserDashboard component (complet)
- [ ] Date range picker
- [ ] Filters: Banque, Domaine, État
- [ ] Document table display
- [ ] View/Download actions
- [ ] Modal preview PDF
- [ ] API service client methods
- [ ] Trace recording on view/download

### Phase 3: Testing & Integration (Priorité 3)
- [ ] Test file watcher avec PDFs manuels
- [ ] Test parsing de noms
- [ ] Test API endpoints
- [ ] Test date filtering
- [ ] Test trace audit
- [ ] Test PDF download/preview
- [ ] Test dashboard filters

### Phase 4: Admin Analytics (Priorité 4)
- [ ] AdminDashboard enhancements
- [ ] Stats: Documents par jour/banque
- [ ] Traces viewer
- [ ] Usage analytics
- [ ] Export data

---

## 9. POINTS IMPORTANTS À RETENIR

### ✅ Architecture Clé
```
Fichier (PDF/Excel/CSV) dans incoming/
  ↓ [FileWatcher détecte]
Parse nom: "502-04-04-2025-etatdeverxxxxxx.xlsx"
  ↓ [Validation]
Cherche État 502 dans BD
  ↓ [Sauvegarde]
Document entity + filePath vers uploads/documents/
  ↓ [Association]
DocumentUser pour tous les Users avec cet État
  ↓ [Frontend]
User Dashboard affiche docs selon permissions + date
  ↓ [Trace]
DOCUMENT_VIEWED / DOCUMENT_DOWNLOADED logged
  ↓ [Display]
Affiche fileName du système (ex: "502-04-04-2025-etatdeverxxxxxx.xlsx")
```

### ✅ Hiérarchie Respectée
- User → États assignés
- États → Domaine (N:1)
- Domaine → Banques (M:M)
- Document = État + Date
- Affichage = fileName (du système externe)

### ✅ Date Filtering
- Frontend: startDate/endDate pickers
- Backend: Document.dateDocument BETWEEN startDate AND endDate
- DocumentUser.dateAcces: NULL jusqu'à consultation

### ✅ Traçabilité Complète
- UPLOAD_RECEIVED: FileWatcher traite PDF
- DOCUMENT_VIEWED: User ouvre modal preview
- DOCUMENT_DOWNLOADED: User télécharge PDF
- IP, timestamp, user_id enregistrés

---

## 10. PROCHAINES ÉTAPES

1. **Implémenter FileWatcherService** - Cœur du système
2. **Créer Document entities** - Fondation BD
3. **Implémenter DocumentController** - API user
4. **Développer UserDashboard** - Frontend
5. **Tester avec PDFs manuels** - Simulation
6. **Ajouter AdminDashboard analytics** - Monitoring
7. **Déploiement & optimization** - Production

---

*Dernière mise à jour: May 6, 2026*  
*Prêt pour implémentation phase User*
