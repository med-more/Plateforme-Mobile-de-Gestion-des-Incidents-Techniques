# 🛠️ Incident Management Application

**Description :**  
Application mobile complète de gestion des incidents permettant aux utilisateurs de déclarer, suivre et gérer des tickets d’incidents, avec une interface dédiée pour les administrateurs. Le projet utilise le stack **MERN** (MongoDB, Express, React Native, Node.js) avec des standards professionnels de développement, sécurité, et structuration du code.

---

## 🚀 Technologies utilisées

### 🧑‍💻 Frontend (React Native – Expo)
- React Native & Expo CLI
- React Navigation (Stack & Tab)
- Axios (communication API)
- AsyncStorage (stockage sécurisé)
- Formik & Yup (validation des formulaires)
- React Native Paper (UI/UX composants)

### 🖥️ Backend (Node.js + Express)
- Express.js
- MongoDB avec Mongoose
- JWT (authentification sécurisée)
- Bcrypt (hash de mot de passe)
- Architecture MVC
- Middleware (authentification, rôles, logs)

---


---

## 📋 Fonctionnalités principales

### 👤 Utilisateurs
- Inscription et connexion sécurisée
- Création de tickets avec priorité et description
- Suivi des statuts : *en attente*, *en cours*, *résolu*
- Modification du profil utilisateur

### 🛠️ Administrateurs
- Visualisation de tous les tickets
- Mise à jour du statut et assignation
- Suppression et gestion des tickets
- Statistiques globales via tableau de bord

---

## 🧑‍🤝‍🧑 Répartition des tâches (Scrum Team)

| Membre     | Rôle | Contributions |
|------------|------|---------------|
| **Chaimaa**  | Authentification | Login/Register, gestion JWT, profil |
| **Hamza**    | Tickets utilisateurs | Création & affichage des tickets |
| **Med**      | Backend & sécurité | Routes API, auth JWT, structure MVC |
| **Lahssen**  | Interface Admin | Dashboard, navigation globale |

---

## 🔐 Sécurité

- 🔒 Authentification par **JWT**
- 🔑 Protection des routes via **middleware**
- 🔏 Hash des mots de passe avec **bcrypt**
- 🧭 Rôles utilisateurs vs administrateurs

---

## 🛠️ Installation

### 1. Backend – Node.js

```bash
cd server
npm install
npm run dev


2. Frontend – Expo (React Native)
bash
Copier
Modifier
cd client
npm install
npx expo start

🧪 Tests
✅ Validation des formulaires avec Formik & Yup

✅ Tests des routes API avec Postman

✅ Tests manuels via simulateurs Android/iOS

📌 Outils et gestion de projet
GitHub pour le versioning (branche par fonctionnalité)

Trello pour la planification Agile/Scrum

Postman pour les tests de l’API

Draw.io pour la creation des diagram uml

📄 Licence
Projet réalisé dans un cadre académique.
Usage pédagogique et démonstratif uniquement.

