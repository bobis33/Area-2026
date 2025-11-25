# State of the Art – Mobile Technologies

## 1. Context

Within the AREA project, the mobile client must allow a user to:

- interact with the server API (authentication, services, actions/reactions, AREA management);
- view or configure their connected services;
- manage their account;
- use the application on Android via an APK generated in Docker.

The mobile client must not contain any business logic: it serves solely as an interface and relay to the REST API.

### Evaluation Criteria

The criteria used to evaluate mobile technologies are:

- learning curve for the team;
- development speed;
- REST API integration;
- OAuth integration;
- tooling quality (debug, build, tests);
- performance;
- Docker compatibility for APK generation;
- long-term maintainability by the team.

### Technologies Studied

The technologies studied are:

- **React Native (Expo)**: JavaScript/TypeScript framework for cross-platform mobile development
- **Flutter**: Google framework based on Dart
- **Native Android (Kotlin)**: Native development with official Android tools

---

## 2. Technology Analysis

### 2.1 React Native + Expo

#### Description

A mobile framework based on JavaScript/TypeScript that allows building native applications for Android/iOS. Expo provides a set of tools that facilitate builds, development, and management of native dependencies.

#### Advantages

- Technology close to what we use on the web (React, TypeScript)
- Low learning curve for the entire team
- Fast development: efficient hot reload, abundant UI libraries
- Excellent integration with REST APIs (fetch, axios)
- Simplified OAuth integration (Expo Auth Session)
- Expo build tools compatible with Docker workflow for APK generation
- Large community and comprehensive documentation
- High maintainability due to standardized JS/TS codebase

#### Disadvantages

- Slightly lower performance than native for complex interfaces
- Dependence on Expo and its versions, requiring some discipline
- Final application size slightly larger than a native app

#### Relevance for AREA

**Highly suitable**: rapid development, simple API integration, ideal for producing a functional POC and delivering the final version on time.

---

### 2.2 Flutter (Dart)

#### Description

Google framework based on the Dart language, offering high-performance rendering through its embedded Skia engine. Flutter compiles to native code for Android and iOS.

#### Advantages

- Excellent performance, smooth animations
- Highly flexible built-in UI components (Material Design and Cupertino)
- Single codebase for Android/iOS
- Stable compilation and reliable APK generation
- Effective hot reload for development
- Active community and supported by Google

#### Disadvantages

- Dart language not familiar to the team → longer learning curve
- More time required to produce a POC and full application
- OAuth integration more technical (requires specific plugins)
- Docker integration more complex if the team has never used Flutter
- Larger application size due to the embedded engine

#### Relevance for AREA

**Less suitable** given the limited time and the need for development accessible to all team members.

---

### 2.3 Native Android (Kotlin)

#### Description

Mobile development directly using official Android tools (Kotlin, Android Studio, Android SDK). Native approach providing full access to platform features.

#### Advantages

- Full access to Android native APIs
- Optimal performance
- Excellent compatibility and stability
- Complete control over user experience
- Official support and exhaustive documentation

#### Disadvantages

- Longer and more verbose development
- Android only (no portability to iOS)
- Requires expertise the team may not have
- Heavier setup for a POC
- Docker APK build more complex (requires Android SDK)
- Maintenance more time-consuming

#### Relevance for AREA

**Too time-consuming**, too difficult for the entire team, poorly suited for a full-stack project with tight deadlines.

---

## 3. Comparative Summary

| Criterion                        | React Native + Expo | Flutter            | Kotlin (Native Android) |
|----------------------------------|---------------------|--------------------|-------------------------|
| **Learning curve**               | Low                 | Medium             | High                    |
| **Development speed**            | Very high           | Medium             | Low                     |
| **REST API integration**         | Simple              | Simple             | Simple                  |
| **OAuth2 integration**           | Simple              | Medium             | Medium                  |
| **Tools / Debug**                | Very good           | Good               | Very good               |
| **Docker APK build**             | Simple              | Moderately complex | Complex                 |
| **Performance**                  | Good                | Excellent          | Excellent               |
| **Maintainability**              | High                | Medium             | Medium                  |
| **Community / Documentation**    | Excellent           | Very good          | Excellent               |
| **Portability (Android/iOS)**    | Yes                 | Yes                | Android only            |
| **Suitability for AREA project** | ⭐⭐⭐ Excellent       | ⭐⭐ Fair            | ⭐ Poor                  |

![Frontend Mobile Comparison](./graph/frontend_mobile_comparison.png)

---

## 4. Conclusion and Technology Choice

### 4.1 Selected Choice: React Native with Expo

Based on the comparative analysis of the three technologies studied, **React Native with Expo** has been chosen as the solution for the AREA project mobile client.

### 4.2 Justification

#### Comparison with Flutter

**Why React Native over Flutter?**

Although Flutter offers excellent performance and a high-quality user experience, React Native presents decisive advantages for our context:

- **Familiar language**: The team already knows JavaScript/TypeScript, unlike Dart, which would require significant learning time
- **Skill reuse**: Developers can reuse their React knowledge from the web client, reducing the learning curve to nearly zero
- **Tight deadlines**: For a time-constrained project, React Native allows immediate start without learning a new language
- **Shared ecosystem**: Shared libraries and patterns with the web client (axios, state management, etc.)
- **Simplified OAuth**: Expo Auth Session provides more direct OAuth integration than Flutter plugins

**Accepted trade-off**: Slightly lower performance of React Native compared to Flutter is acceptable for an application mainly focused on user interface and API communication, where the performance difference will not be noticeable.

#### Comparison with Kotlin (Native Android)

**Why React Native over Kotlin?**

Native Android development has major limitations for our project:

- **Portability**: Kotlin targets Android only, whereas React Native allows future portability to iOS without rewriting
- **Development time**: Native development is more verbose and requires more code for equivalent features
- **Required expertise**: The team would need specific Android skills (SDK, Gradle, Android architecture) that are not reusable elsewhere
- **Docker build**: Android build setup in Docker is more complex (requires Android SDK, license management, etc.)
- **Maintenance**: More time-consuming long-term for a full-stack team

**React Native advantage**: Single codebase for Android (and potentially iOS), with simplified build via Expo.

### 4.3 Specific Advantages for AREA

Main reasons justifying this choice:

1. **Existing expertise**: Team knowledge of JavaScript/TypeScript enables immediate start
2. **Fast development**: Efficient hot reload, abundant UI libraries, ideal for POC and full application within deadlines
3. **Smooth integration**: Natural compatibility with the existing REST API (same tech stack)
4. **Simplified authentication**: OAuth management via Expo Auth Session, crucial for AREA with multiple OAuth providers
5. **Robust tooling**: Simplified APK generation in Docker workflow via Expo EAS Build
6. **Ease of maintenance**: Complete documentation, active community, standardized JS/TS codebase
7. **Maximum productivity**: Reuse of web skills, mature React ecosystem, cross-platform development

### 4.4 Expected Benefits

This solution ensures:

- **Rapid skill acquisition**: All team members can contribute immediately
- **Increased productivity**: Reuse of existing web skills
- **On-time delivery**: Efficient development to meet project deadlines
- **Maintainable codebase**: JS/TS standards shared with the rest of the project
- **Scalability**: Possibility to extend to iOS without major rewrite



---

# Version Française

---



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

| Critère                        | React Native + Expo | Flutter              | Kotlin (Android Natif) |
|--------------------------------|---------------------|----------------------|------------------------|
| **Courbe d'apprentissage**     | Faible              | Moyenne              | Élevée                 |
| **Rapidité de développement**  | Très élevée         | Moyenne              | Faible                 |
| **Intégration API REST**       | Simple              | Simple               | Simple                 |
| **Intégration OAuth2**         | Simple              | Moyenne              | Moyenne                |
| **Outils / Debug**             | Très bon            | Bon                  | Très bon               |
| **Build APK dans Docker**      | Simple              | Moyennement complexe | Complexe               |
| **Performances**               | Bonnes              | Excellentes          | Excellentes            |
| **Maintenabilité**             | Élevée              | Moyenne              | Moyenne                |
| **Communauté / Documentation** | Excellente          | Très bonne           | Excellente             |
| **Portabilité (Android/iOS)**  | Oui                 | Oui                  | Android uniquement     |
| **Adapté au projet AREA**      | ⭐⭐⭐ Excellent       | ⭐⭐ Correct           | ⭐ Faible               |

![Frontend Mobile Comparison](./graph/frontend_mobile_comparison.png)

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
