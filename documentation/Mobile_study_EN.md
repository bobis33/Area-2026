# State of the Art – Mobile Technologies

## 1. Context

As part of the AREA project, the mobile client must allow a user to:

- interact with the backend API (authentication, services, actions/reactions, AREA management);
- view or configure their connected services;
- manage their account;
- run the application on Android through an APK generated via Docker.

The mobile client must not contain any business logic. Its role is strictly to serve as a user interface and a relay to the REST API.

### Evaluation Criteria

The criteria used to evaluate possible mobile technologies are:

- learning curve for the development team;
- development speed and productivity;
- REST API integration capabilities;
- OAuth integration capabilities;
- quality of tooling (debugging, building, testing);
- runtime performance;
- compatibility with Docker workflows for APK generation;
- long-term maintainability by the team.

### Technologies Evaluated

The following technologies were evaluated:

- **React Native (Expo)** – JavaScript/TypeScript cross-platform mobile framework
- **Flutter** – Google framework based on Dart
- **Native Android (Kotlin)** – Mobile development using official Android tools

---

## 2. Technology Analysis

### 2.1 React Native + Expo

#### Description

React Native is a JavaScript/TypeScript-based framework for building native Android/iOS applications. Expo is an ecosystem built on top of React Native that simplifies development, bundling, and native dependency management.

#### Advantages

- Technology aligned with the team's web stack (React, TypeScript)
- Excellent learning curve for all members
- Fast development: efficient hot reload and extensive UI libraries
- Straightforward REST API integration (fetch, axios)
- Simplified OAuth integration (Expo Auth Session)
- Expo build tools compatible with Docker workflows for generating APKs
- Large community and comprehensive documentation
- High maintainability thanks to a consistent JS/TS codebase

#### Disadvantages

- Slightly lower performance compared to native apps for very complex UI
- Dependency on Expo's ecosystem and versioning constraints
- Slightly larger APK size than fully native apps

#### Relevance for AREA

**Highly suitable**: fast development, easy API integration, and ideal for creating both a POC and the final application within the given timeframe.

---

### 2.2 Flutter (Dart)

#### Description

Flutter is Google's UI framework using the Dart language. It provides excellent performance through the embedded Skia rendering engine and compiles to native code.

#### Advantages

- Outstanding performance and smooth animations
- Built-in flexible UI components (Material Design, Cupertino)
- Single codebase for Android and iOS
- Solid compilation tools and reliable APK production
- Efficient hot reload for rapid development
- Active community and strong Google support

#### Disadvantages

- Dart is not currently known by the team → steeper learning curve
- Longer time required to produce a functional POC
- OAuth integration more technical (external plugins required)
- Dockerized builds more complex for teams unfamiliar with Flutter
- Larger application size due to embedded engine

#### Relevance for AREA

**Less suitable** due to limited team familiarity and tighter project deadlines.

---

### 2.3 Native Android (Kotlin)

#### Description

Android native development uses Kotlin, Android Studio, and the official Android SDK. It provides complete access to all platform features and the highest performance.

#### Advantages

- Full access to all native Android APIs
- Optimal runtime performance
- Excellent stability and platform support
- Complete control over the user experience
- Extensive official documentation

#### Disadvantages

- Long and more verbose development process
- Android-only (no cross-platform output)
- Requires deep Android expertise not shared by the team
- Heavier setup for a POC
- More complex Docker integration (Android SDK, license acceptance)
- Higher long-term maintenance cost

#### Relevance for AREA

**Too time-consuming** and not aligned with team knowledge, making it unsuitable for the project.

---

## 3. Comparative Summary

| Criterion | React Native + Expo | Flutter | Kotlin (Native Android) |
|-----------|---------------------|---------|-------------------------|
| **Learning Curve** | Low | Medium | High |
| **Development Speed** | Very high | Medium | Low |
| **REST API Integration** | Easy | Easy | Easy |
| **OAuth2 Integration** | Easy | Medium | Medium |
| **Tooling / Debugging** | Excellent | Good | Excellent |
| **APK Build in Docker** | Easy | Moderate | Complex |
| **Performance** | Good | Excellent | Excellent |
| **Maintainability** | High | Medium | Medium |
| **Community / Documentation** | Excellent | Very good | Excellent |
| **Portability (Android/iOS)** | Yes | Yes | Android only |
| **Fit for AREA** | ⭐⭐⭐ Excellent | ⭐⭐ Adequate | ⭐ Weak |

---

## 4. Conclusion and Technology Choice

### 4.1 Selected Technology: React Native with Expo

Based on all analyses, **React Native with Expo** is the most appropriate solution for the AREA mobile client.

### 4.2 Justification

#### Comparison with Flutter

**Why React Native rather than Flutter?**

Despite Flutter's strong performance and attractive UI capabilities, React Native is more aligned with our requirements:

- **Familiar language**: The team already uses JavaScript/TypeScript, unlike Dart which would require significant learning time
- **Skill reusability**: Developers can reuse their React knowledge from the web client, reducing the learning curve to almost zero
- **Time constraints**: For a project with tight deadlines, React Native allows immediate start without a language learning phase
- **Shared ecosystem**: Common libraries and patterns with the web client (axios, state management, etc.)
- **Simplified OAuth**: Expo Auth Session offers easier implementation than Flutter plugins

**Trade-off**: Minor performance drawbacks are acceptable for an app centered around API calls and form-based interfaces, where the performance difference will not be noticeable.

#### Comparison with Kotlin (Native Android)

**Why React Native rather than Kotlin?**

Native Android presents several limitations:

- **Android-only**: No cross-platform option, whereas React Native allows future iOS portability without rewriting
- **More verbose**: Longer development cycles requiring more code for equivalent features
- **Specialized knowledge**: Requires deep Android expertise not shared by the team
- **Docker complexity**: More complicated Docker integration for APK builds (Android SDK, license management, etc.)

**React Native advantage**: One codebase, simpler build process, and much faster productivity.

### 4.3 AREA-Specific Benefits

Key reasons for selecting React Native + Expo:

1. **Existing team expertise** in JavaScript/TypeScript, enabling immediate start
2. **Rapid development cycle** with hot reload and abundant UI components
3. **Seamless integration** with the existing REST API backend
4. **Simplified OAuth handling** via Expo Auth Session (essential for AREA)
5. **Robust tooling** including Expo EAS for APK generation
6. **High maintainability** through a consistent and well-known stack
7. **Strong productivity** due to shared ecosystem with the web client

### 4.4 Expected Benefits

This approach ensures:

- **Fast team onboarding**: All team members can contribute immediately
- **Improved productivity**: Reuse of existing web skills
- **Timely delivery**: Efficient development to meet project deadlines
- **Stable and maintainable codebase**: Shared JS/TS standards with the rest of the project
- **Future scalability**: Potential iOS support without rewriting the app

---

## 📚 Sources

### Official Documentation

- React Native – https://reactnative.dev/docs/getting-started
- Expo – https://docs.expo.dev
- Flutter – https://docs.flutter.dev
- Kotlin Android – https://developer.android.com/kotlin

### Benchmarks & Studies

- React Native vs Flutter performance analysis:
  https://inveritasoft.com/blog/flutter-vs-react-native-performance
- Cross-platform comparison by Google Developers:
  https://firebase.blog/posts/2021/05/flutter-react-native-firebase
- Expo AuthSession OAuth reference:
  https://docs.expo.dev/guides/authentication/

---
