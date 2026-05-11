# Présentation du projet (pour le client)

## 1) Le projet en bref
Ce projet met en place une application web qui permet de gérer des Etats  destinés à différentes banques, et de garantir que **chaque utilisateur voit uniquement ce qui lui est autorisé**.

## 2) À qui s’adresse l’application ?
- **Administrateurs** : gèrent la structure (catégories, types de documents, institutions) et attribuent les droits ainsi que garder une tracabilité.
- **Utilisateurs des banques** : consultent les documents qui correspondent à leurs droits, avec un filtrage

## 3) Comment fonctionne la gestion des documents ?
1. Chaque document est rattaché à un état réglementaire.
3. Ensuite, les documents deviennent **accessibles automatiquement** aux utilisateurs concernés.
4. L’application garde une trace des actions (consultation/téléchargement) pour fiabilité et suivi.

## 4) Organisation métier (ce que le système représente)
L’application structure le besoin de manière simple pour l’utilisateur :
- **États réglementaires** : les documents associés à un type précis.
- **Domaines** : regroupent des états.
- **Banques (institutions)** : chaque banque est reliée à des domaines et donc à des états.
- **Utilisateurs** : chaque utilisateur est rattaché à une ou plusieurs banques, et reçoit donc les documents correspondant à ses droits.

## 5) Fonctionnalités principales
### Pour les administrateurs
- Créer et gérer les **états** et leurs documents.
- Gérer les **domaines** (catégories) et l’organisation des états.
- Gérer les **banques** et leurs attributions.
- Créer et gérer les **utilisateurs** et leurs droits.
- Visualiser les **actions et traces** liées au système.

### Pour les utilisateurs
- Se connecter.
- Consulter la liste des documents qui leur sont autorisés.
- Filtrer les documents par **période**.
- Visualiser et télécharger les documents.
