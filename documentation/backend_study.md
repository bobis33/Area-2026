# State of the Art – Backend Architecture

## 1. Contexte

Dans le cadre du projet AREA, le serveur d'application joue un rôle central de "chef d'orchestre". Il est le seul composant autorisé à embarquer la logique métier (_business logic_) du projet.

Ses responsabilités principales sont :

- **Exposer une API REST** pour les clients Web et Mobile.
- **Gérer l'authentification** des utilisateurs et l'intégration OAuth2 avec des services tiers.
- **Orchestrer les automatisations** en interconnectant des _Actions_ et des _REActions_ via un système de _Hooks_.
- **Agir comme une "colle" (_glue_)** entre les différentes briques logicielles et API externes sélectionnées.

L'architecture doit être construite autour de conteneurs et déployée via Docker Compose.

### Critères d'évaluation

Les critères retenus pour évaluer les technologies backend sont :

- **Performance I/O (Entrées/Sorties)** : Capacité à gérer de multiples appels API externes simultanément sans bloquer le serveur (essentiel pour le rôle de "glue").
- **Sécurité du typage** : Robustesse du code pour faciliter le travail en groupe et la maintenance.
- **Écosystème** : Disponibilité de librairies pour intégrer facilement les services tiers demandés.
- **Unification** : Possibilité de partager le langage ou les concepts avec le frontend.
- **Intégrité des données** : Capacité à gérer des relations complexes (Utilisateurs <-> Services <-> AREA) de manière fiable.

### Technologies étudiées

Les technologies étudiées pour le serveur d'application sont :

- **Node.js (NestJS)** : Runtime JavaScript asynchrone avec un framework structuré en TypeScript.
- **Python (Django/Flask)** : Langage populaire pour le script et le web.
- **PHP (Laravel/Symfony)** : Langage historique du web, fonctionnant sur un modèle requête/réponse synchrone.

---

## 2. Analyse des technologies

### 2.1 Node.js (NestJS + TypeScript)

#### Description

Node.js est un environnement d'exécution JavaScript basé sur le moteur V8, utilisant un modèle d'E/S non bloquant. NestJS est un framework qui impose une architecture modulaire et l'utilisation de TypeScript.

#### Avantages

- **Architecture Non-Bloquante** : Idéale pour le rôle de "glue", permettant d'attendre plusieurs réponses d'API externes simultanément (Google, Outlook, etc.) sans ralentir le serveur.
- **Typage Fort (TypeScript)** : Sécurise les structures de données complexes (Actions, Réactions) et réduit les bugs.
- **Unification Full-Stack** : Utilisation du même langage (JS/TS) que les clients Web et Mobile, facilitant la mobilité de l'équipe.
- **Écosystème NPM** : Accès immédiat à des milliers de paquets pour gérer l'OAuth2 et les API tierces demandées par le sujet.

#### Inconvénients

- **Courbe d'apprentissage NestJS** : Nécessite de comprendre l'injection de dépendances (DI) et les décorateurs.

#### Pertinence pour AREA

**Très adaptée** : La gestion native de l'asynchronisme est parfaite pour le mécanisme de Hook qui doit vérifier périodiquement si des événements se sont produits.

---

### 2.2 Python (Django / Flask)

#### Description

Python est un langage interprété apprécié pour sa lisibilité. Django est un framework complet ("batteries included"), tandis que Flask est plus léger.

#### Avantages

- **Simplicité** : Syntaxe claire et concise, rapide à prendre en main.
- **Prototypage** : Permet de développer un POC (_Proof of Concept_) très rapidement.
- **Bibliothèques** : Excellent support pour le scripting et l'automatisation.

#### Inconvénients

- **Modèle Synchrone (GIL)** : Moins performant pour gérer massivement des I/O concurrents (appels API multiples) sans configuration complexe (AsyncIO).
- **Typage Dynamique** : Risque d'erreurs de type lors de l'exécution, surtout sur un projet long impliquant de nombreuses structures de données.
- **Fragmentation** : Nécessite de maîtriser deux langages différents (Python pour le back, JS pour le front).

#### Pertinence pour AREA

**Moyennement adapté** : Bien que capable, il complexifie la stack technique de l'équipe (deux langages) pour un gain de performance discutable sur ce type de projet d'intégration API.

---

### 2.3 PHP (Laravel / Symfony)

#### Description

PHP est conçu pour le web, fonctionnant traditionnellement sur un modèle synchrone où chaque requête est isolée ("Share-nothing").

#### Avantages

- **Maturité** : Frameworks très stables et documentation exhaustive.
- **Déploiement** : Facile à conteneuriser avec Docker.

#### Inconvénients

- **Architecture Bloquante** : Le modèle synchrone rend difficile la mise en œuvre de _Hooks_ permanents ou de _polling_ efficace sans outils externes lourds.
- **Philosophie** : Conçu pour servir des pages HTML, moins adapté pour être un pur agrégateur d'API JSON en temps réel.
- **Typage** : Moins strict que TypeScript, ce qui peut être un frein pour la rigueur attendue sur ce projet de groupe.

#### Pertinence pour AREA

**Peu adapté** : Le besoin de gérer des événements asynchrones (Hooks) entre en conflit avec l'architecture traditionnelle de PHP.

---

## 3. Synthèse comparative

| Critère                       | Node.js (NestJS)  | Python (Django) | PHP (Laravel) |
| :---------------------------- | :---------------- | :-------------- | :------------ |
| **Performance I/O (Async)**   | ⭐⭐⭐ Excellente | ⭐⭐ Moyenne    | ⭐ Faible     |
| **Sécurité du Typage**        | ⭐⭐⭐ Forte (TS) | ⭐ Faible       | ⭐⭐ Moyenne  |
| **Unification (Front/Back)**  | ⭐⭐⭐ Oui        | ❌ Non          | ❌ Non        |
| **Gestion des Hooks/Polling** | ⭐⭐⭐ Native     | ⭐⭐ Moyenne    | ⭐ Complexe   |
| **Compatibilité Docker**      | ⭐⭐⭐ Simple     | ⭐⭐⭐ Simple   | ⭐⭐⭐ Simple |
| **Adapté au projet AREA**     | ⭐⭐⭐ Excellent  | ⭐⭐ Correct    | ⭐ Faible     |

---

## 4. Conclusion et choix technologique

### 4.1 Choix retenu : Stack Node.js / PostgreSQL / Prisma

Au regard de l'analyse comparative et des besoins du projet, la stack suivante est retenue :

- **Serveur :** Node.js avec NestJS
- **Base de données :** PostgreSQL
- **ORM :** Prisma

### 4.2 Justification du choix

#### Backend : Node.js vs PHP/Python

Le choix de **Node.js** est motivé par sa nature asynchrone, idéale pour le rôle de "glue" entre les services. Contrairement à PHP (synchrone) ou Python (souvent bloquant par défaut), Node.js peut gérer efficacement le _polling_ des Hooks sans bloquer les requêtes des utilisateurs. De plus, l'utilisation de **TypeScript** sur l'ensemble du projet unifie les compétences de l'équipe.

#### Base de données : PostgreSQL

Le projet nécessite une structure rigoureuse pour gérer les utilisateurs et les liaisons AREA. **PostgreSQL** est choisi pour garantir l'intégrité des données (ACID), assurant que chaque _Action_ est correctement liée à une _Réaction_, ce qui serait plus risqué avec une solution NoSQL.

#### ORM : Prisma

**Prisma** est retenu pour son typage de bout en bout (_Type Safety_). Il permet de générer un client TypeScript synchronisé avec la base de données, facilitant l'évolution du schéma lors de l'ajout de nouveaux services et réduisant drastiquement les bugs.

### 4.3 Bénéfices attendus

Cette solution garantit :

- **Robustesse** : Typage strict et intégrité relationnelle SQL.
- **Réactivité** : Gestion optimale des I/O pour les interactions avec les API tierces.
- **Maintenance** : Code structuré et unifié, facilitant la reprise du projet par n'importe quel membre du groupe.
- **Respect des consignes** : Architecture déployable via Docker Compose et séparant clairement la logique métier.
