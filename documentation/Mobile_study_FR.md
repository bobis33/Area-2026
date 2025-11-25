# State of the Art – Mobile Technologies

## 1. Contexte

Dans le cadre du projet AREA, le client mobile doit permettre à un utilisateur :

- d'interagir avec l'API du serveur (authentification, services, actions/réactions, gestion des AREA) ;
- de consulter ou configurer ses services connectés ;
- de gérer son compte ;
- d'utiliser l'application sur Android via un APK généré en Docker.

Le client mobile ne doit contenir aucune logique métier : il sert uniquement d'interface et de relais vers l'API REST.

### Critères d'évaluation

Les critères retenus pour évaluer les technologies mobiles sont :

- courbe d'apprentissage pour l'équipe ;
- rapidité de développement ;
- intégration API REST ;
- intégration OAuth ;
- qualité du tooling (debug, build, tests) ;
- performances ;
- compatibilité avec Docker pour générer l'APK ;
- maintenabilité à long terme par l'équipe.

### Technologies étudiées

Les technologies étudiées sont :

- **React Native (Expo)** : Framework JavaScript/TypeScript pour le développement mobile cross-platform
- **Flutter** : Framework Google basé sur Dart
- **Android Natif (Kotlin)** : Développement natif avec les outils officiels Android

---

## 2. Analyse des technologies

### 2.1 React Native + Expo

#### Description

Framework mobile basé sur JavaScript/TypeScript permettant de développer des applications natives pour Android/iOS. Expo fournit un ensemble d'outils facilitant les builds, le développement et la gestion des dépendances natives.

#### Avantages

- Technologie proche de ce que nous utilisons côté web (React, TypeScript)
- Courbe d'apprentissage faible pour toute l'équipe
- Développement rapide : hot reload performant, bibliothèque d'UI abondante
- Très bonne intégration avec les API REST (fetch, axios)
- Intégration OAuth simplifiée (Expo Auth Session)
- Outils de build Expo compatibles avec un workflow Docker pour générer un APK
- Communauté large et documentation complète
- Maintenabilité élevée grâce à une base JS/TS standardisée

#### Inconvénients

- Performances légèrement inférieures à du natif pour des interfaces complexes
- Dépendance à Expo et ses versions, nécessitant une certaine rigueur
- Taille de l'application finale légèrement plus importante qu'une application native

#### Pertinence pour AREA

**Très adaptée** : développement rapide, intégration API simple, idéal pour produire un POC fonctionnel et la version finale dans les temps.

---

### 2.2 Flutter (Dart)

#### Description

Framework Google basé sur le langage Dart, permettant un rendu performant grâce à son moteur embarqué Skia. Flutter compile vers du code natif pour Android et iOS.

#### Avantages

- Performances excellentes, animations fluides
- Composants UI intégrés très flexibles (Material Design et Cupertino)
- Un seul code source pour Android/iOS
- Compilation stable et production d'APK fiable
- Hot reload efficace pour le développement
- Communauté active et supporté par Google

#### Inconvénients

- Langage Dart peu maîtrisé par l'équipe → courbe d'apprentissage plus longue
- Plus de temps pour produire un POC et une application complète
- Intégration OAuth plus technique (nécessite des plugins spécifiques)
- Intégration dans Docker plus complexe si l'équipe n'a jamais utilisé Flutter
- Taille de l'application plus importante due au moteur embarqué

#### Pertinence pour AREA

**Moins adapté** compte tenu du temps limité et du besoin d'un développement accessible à tous les membres de l'équipe.

---

### 2.3 Android Natif (Kotlin)

#### Description

Développement mobile directement avec les outils officiels Android (Kotlin, Android Studio, SDK Android). Approche native offrant un accès complet aux fonctionnalités de la plateforme.

#### Avantages

- Accès complet aux APIs natives Android
- Performances optimales
- Excellente compatibilité et stabilité
- Contrôle total sur l'expérience utilisateur
- Support officiel et documentation exhaustive

#### Inconvénients

- Développement plus long et plus verbeux
- Uniquement Android (aucune portabilité vers iOS)
- Nécessite une expertise que l'équipe ne possède pas forcément
- Mise en place plus lourde pour un POC
- Build dans Docker plus complexe à automatiser (nécessite Android SDK)
- Maintenance plus coûteuse en temps

#### Pertinence pour AREA

**Trop coûteux en temps**, trop difficile pour l'ensemble de l'équipe, peu adapté pour un projet full-stack avec contraintes fortes de délai.

---

## 3. Synthèse comparative

| Critère | React Native + Expo | Flutter | Kotlin (Android Natif) |
|---------|---------------------|---------|------------------------|
| **Courbe d'apprentissage** | Faible | Moyenne | Élevée |
| **Rapidité de développement** | Très élevée | Moyenne | Faible |
| **Intégration API REST** | Simple | Simple | Simple |
| **Intégration OAuth2** | Simple | Moyenne | Moyenne |
| **Outils / Debug** | Très bon | Bon | Très bon |
| **Build APK dans Docker** | Simple | Moyennement complexe | Complexe |
| **Performances** | Bonnes | Excellentes | Excellentes |
| **Maintenabilité** | Élevée | Moyenne | Moyenne |
| **Communauté / Documentation** | Excellente | Très bonne | Excellente |
| **Portabilité (Android/iOS)** |  Oui |  Oui |  Android uniquement |
| **Adapté au projet AREA** | ⭐⭐⭐ Excellent | ⭐⭐ Correct | ⭐ Faible |

---

## 4. Conclusion et choix technologique

### 4.1 Choix retenu : React Native avec Expo

Au regard de l'analyse comparative des trois technologies étudiées, **React Native avec Expo** a été retenu comme solution pour le client mobile du projet AREA.

### 4.2 Justification du choix

#### Comparaison avec Flutter

**Pourquoi React Native plutôt que Flutter ?**

Bien que Flutter offre d'excellentes performances et une expérience utilisateur de qualité, React Native présente des avantages décisifs pour notre contexte :

- **Langage familier** : L'équipe maîtrise déjà JavaScript/TypeScript, contrairement à Dart qui nécessiterait un temps d'apprentissage significatif
- **Réutilisation des compétences** : Les développeurs peuvent réutiliser leurs connaissances React du client web, réduisant la courbe d'apprentissage à quasi zéro
- **Délais serrés** : Pour un projet avec contraintes temporelles, React Native permet de démarrer immédiatement sans phase d'apprentissage du langage
- **Écosystème partagé** : Partage de bibliothèques et de patterns avec le client web (axios, gestion d'état, etc.)
- **OAuth simplifié** : Expo Auth Session offre une intégration OAuth plus directe que les plugins Flutter

**Compromis accepté** : Les performances légèrement inférieures de React Native par rapport à Flutter sont acceptables pour une application principalement orientée interface utilisateur et communication API, où la différence de performance ne sera pas perceptible.

#### Comparaison avec Kotlin (Android Natif)

**Pourquoi React Native plutôt que Kotlin ?**

Le développement natif Android présente des limitations majeures pour notre projet :

- **Portabilité** : Kotlin ne cible que Android, alors que React Native permet une portabilité future vers iOS sans réécriture
- **Temps de développement** : Le développement natif est plus verbeux et nécessite plus de code pour des fonctionnalités équivalentes
- **Expertise requise** : L'équipe devrait acquérir des compétences spécifiques Android (SDK, Gradle, architecture Android) qui ne sont pas réutilisables ailleurs
- **Build Docker** : La configuration du build Android dans Docker est plus complexe (nécessite Android SDK, gestion des licences, etc.)
- **Maintenance** : Plus coûteuse en temps à long terme pour une équipe full-stack

**Avantage React Native** : Une seule base de code pour Android (et potentiellement iOS), avec un build simplifié via Expo.

### 4.3 Avantages spécifiques pour AREA

Les raisons principales qui justifient ce choix sont :

1. **Maîtrise existante** : Connaissance du JavaScript/TypeScript au sein de l'équipe, permettant un démarrage immédiat
2. **Développement rapide** : Hot reload performant, bibliothèques UI abondantes, idéal pour un POC et une application complète dans les délais
3. **Intégration fluide** : Compatibilité naturelle avec l'API REST déjà développée (même stack technologique)
4. **Authentification simplifiée** : Gestion OAuth facilitée via Expo Auth Session, cruciale pour AREA qui nécessite plusieurs providers OAuth
5. **Tooling robuste** : Génération d'APK simplifiée dans un workflow Docker via Expo EAS Build
6. **Maintenance facilitée** : Documentation complète, communauté active, base de code standardisée JS/TS
7. **Productivité maximale** : Réutilisation des compétences web, écosystème React mature, développement cross-platform

### 4.4 Bénéfices attendus

Cette solution garantit :

- **Montée en compétence rapide** : Tous les membres de l'équipe peuvent contribuer immédiatement
- **Productivité accrue** : Réutilisation des compétences web existantes
- **Livraison dans les temps** : Développement efficace pour respecter les délais du projet
- **Base de code maintenable** : Standards JS/TS partagés avec le reste du projet
- **Évolutivité** : Possibilité d'étendre vers iOS sans réécriture majeure

---

## 📚 Sources

### Documentation officielle

- React Native – https://reactnative.dev/docs/getting-started
- Expo – https://docs.expo.dev
- Flutter – https://docs.flutter.dev
- Kotlin Android – https://developer.android.com/kotlin

### Benchmarks et études

- Analyse de performance React Native vs Flutter :
  https://inveritasoft.com/blog/flutter-vs-react-native-performance
- Comparaison cross-platform par Google Developers :
  https://firebase.blog/posts/2021/05/flutter-react-native-firebase
- Référence OAuth Expo AuthSession :
  https://docs.expo.dev/guides/authentication/

---
