# Backend Debug - TODO List

## Problèmes identifiés:

### 1. Entity User.java
- **Problème**: Code dupliqué à la fin (lignes 44-90) - getters/setters重复
- **Correction**: Supprimer le code dupliqué, garder uniquement les imports manquants (Set, HashSet)

### 2. Entity Code.java
- **Problème**: Fichier vide ou presque (// Supprimé : remplacé parEtat)
- **Correction**: Réécrire l'entité Code complète

### 3. Entity Banque.java
- **Problème**: Imports manquants - Set et HashSet non importés
- **Correction**: Ajouter les imports necesarios

### 4. Entity Domaine.java
- **Problème**: Imports manquants - Set et HashSet non importés  
- **Correction**: Ajouter les imports necesarios

### 5. GlobalExceptionHandler.java
- **Problème**: Fichier vide
- **Correction**: Créer le gestionaire d'exceptions complet

### 6. UserRepository.java
- **Problème**: Méthode findByDomaineId utilise une relation ManyToMany incorrecte
- **Correction**: Utiliser @Query avec JOIN pour la relation

### 7. AuthServiceImpl.java (Amélioration sécurité)
- **Problème**: Mot de passe stocké en texte clair
- **Correction**: Ajouter BCrypt password encoding

## Étapes de correction:
1. ⬜ Fixer User.java - imports + supprimer code dupliqué
2. ⬜ Fixer Code.java - réécrire l'entité
3. ⬜ Fixer Banque.java - ajouter imports
4. ⬜ Fixer Domaine.java - ajouter imports
5. ⬜ Fixer GlobalExceptionHandler.java - créer le handler
6. ⬜ Fixer UserRepository.java - @Query pour findByDomaineId
7. ⬜ Améliorer AuthServiceImpl.java - BCrypt encoding
