# 📱 Client Mobile - AREA

Application mobile React Native développée avec Expo pour la plateforme AREA (Automated Reactive Event Architecture).

## 📋 Table des matières

- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Scripts disponibles](#-scripts-disponibles)
- [Structure du projet](#-structure-du-projet)
- [Authentification OAuth](#-authentification-oauth)
- [Dépannage](#-dépannage)

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version >= 24.0.0)
- **npm** (version >= 11.0.0)
- **Docker** et **Docker Compose** (pour les services backend)
- **Expo CLI** (installé globalement ou via npx)
- **Expo Go** (application mobile pour tester sur appareil physique)

### Installation d'Expo CLI

```bash
npm install -g expo-cli
```

Ou utilisez `npx` pour éviter l'installation globale :

```bash
npx expo start
```

## 📦 Installation

1. **Cloner le repository** (si ce n'est pas déjà fait) :

```bash
git clone <repository-url>
cd Area
```

2. **Installer les dépendances** :

```bash
cd client/mobile
npm install
```

3. **Installer les dépendances du workspace** (depuis la racine du projet) :

```bash
npm install
```

## ⚙️ Configuration

### Variables d'environnement

Le client mobile utilise des variables d'environnement pour configurer l'URL de l'API backend.

#### Option 1 : Fichier `.env` (recommandé)

Créez un fichier `.env` à la racine du projet `client/mobile/` :

```env
# URL complète de l'API (prioritaire)
EXPO_PUBLIC_API_URL=http://localhost:8080

# OU seulement le port (construit http://localhost:PORT)
EXPO_PUBLIC_API_PORT=8080
```

#### Option 2 : Variables d'environnement système

```bash
export EXPO_PUBLIC_API_URL=http://localhost:8080
```

### ⚠️ Configuration pour appareil mobile physique

**Important** : Si vous testez sur un appareil physique (iOS/Android), vous devez utiliser l'**IP de votre machine** au lieu de `localhost`.

1. **Trouver votre IP locale** :

```bash
# macOS / Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

2. **Configurer l'URL avec votre IP** :

```env
EXPO_PUBLIC_API_URL=http://10.134.199.30:8080
```

Remplacez `10.134.199.30` par votre IP locale.

## 🚀 Lancement

### Étape 1 : Démarrer les services backend

Depuis la **racine du projet**, lancez les services nécessaires avec Docker Compose :

```bash
docker-compose up area_service_postgresql area_service_server
```

Cette commande démarre :
- **PostgreSQL** : Base de données
- **Server** : API backend NestJS

Les services seront disponibles sur :
- **API Backend** : `http://localhost:8080` (par défaut)
- **PostgreSQL** : `localhost:5432` (par défaut)

### Étape 2 : Lancer le client mobile

Depuis le dossier `client/mobile/`, lancez l'application :

```bash
npm start
```

Cette commande démarre le serveur de développement Expo et affiche un QR code dans le terminal.

### Options de lancement

Une fois le serveur Expo démarré, vous pouvez :

- **Scanner le QR code** avec Expo Go (iOS) ou l'application Expo Go (Android)
- **Appuyer sur `a`** pour ouvrir sur un émulateur Android
- **Appuyer sur `i`** pour ouvrir sur un simulateur iOS (macOS uniquement)
- **Appuyer sur `w`** pour ouvrir dans le navigateur web

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement Expo |
| `npm run android` | Lance l'application sur un émulateur Android |
| `npm run ios` | Lance l'application sur un simulateur iOS (macOS uniquement) |
| `npm run web` | Lance l'application dans le navigateur web |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run reset-project` | Réinitialise le projet Expo (supprime les fichiers générés) |

## 📁 Structure du projet

```
client/mobile/
├── app/                    # Routes Expo Router
│   ├── (auth)/            # Routes d'authentification
│   │   ├── login.tsx      # Page de connexion
│   │   └── register.tsx   # Page d'inscription
│   ├── (tabs)/            # Routes avec navigation par onglets
│   │   ├── index.tsx      # Page d'accueil
│   │   ├── explore.tsx    # Page d'exploration
│   │   └── users.tsx      # Page des utilisateurs
│   └── _layout.tsx        # Layout racine
├── components/            # Composants réutilisables
│   ├── auth/             # Composants d'authentification
│   │   └── SocialLoginButtons.tsx
│   └── ui-mobile/        # Composants UI spécifiques mobile
├── constants/            # Constantes de l'application
│   ├── api.ts           # Configuration API
│   └── theme.ts          # Thème de l'application
├── contexts/            # Contextes React
│   └── AuthContext.tsx   # Contexte d'authentification
├── hooks/               # Hooks personnalisés
├── services/            # Services API
│   └── api.service.ts   # Service API principal
├── types/               # Types TypeScript
│   └── api.ts           # Types API
└── package.json         # Dépendances et scripts
```

## 🔐 Authentification OAuth

L'application supporte plusieurs méthodes d'authentification :

### 1. Email / Mot de passe

Authentification classique avec email et mot de passe.

### 2. OAuth (Discord, GitHub, Google)

L'authentification OAuth utilise des **deep links** pour rediriger vers l'application après authentification.

#### Flux OAuth mobile

1. L'utilisateur clique sur un bouton OAuth (ex: "Continue with Discord")
2. Le navigateur s'ouvre avec l'URL d'authentification
3. L'utilisateur s'authentifie sur le provider
4. Le callback redirige vers `area://auth/success?user=...&token=...`
5. L'application intercepte le deep link et connecte l'utilisateur

#### Configuration des deep links

Le schéma `area://` est configuré dans `app.json` :

```json
{
  "expo": {
    "scheme": "area"
  }
}
```

#### Configuration backend

Assurez-vous que les variables d'environnement suivantes sont configurées dans le backend :

```env
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_CLIENT_CALLBACK_URL=http://<VOTRE_IP>:8080/auth/discord/callback

GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CLIENT_CALLBACK_URL=http://<VOTRE_IP>:8080/auth/github/callback

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CLIENT_CALLBACK_URL=http://<VOTRE_IP>:8080/auth/google/callback
```

**Important** : Pour les tests sur appareil mobile, utilisez votre IP locale dans les URLs de callback.

## 🐛 Dépannage

### Problème : L'application ne peut pas se connecter à l'API

**Solution** :
1. Vérifiez que les services backend sont démarrés : `docker-compose ps`
2. Vérifiez l'URL de l'API dans `.env` ou les variables d'environnement
3. Si vous testez sur un appareil physique, utilisez votre IP locale au lieu de `localhost`
4. Vérifiez que le port de l'API (8080 par défaut) est accessible

### Problème : Les deep links OAuth ne fonctionnent pas

**Solution** :
1. Vérifiez que le schéma `area://` est bien configuré dans `app.json`
2. Vérifiez que les URLs de callback dans le backend utilisent votre IP locale
3. Sur iOS, assurez-vous que l'application Expo Go est installée
4. Sur Android, vérifiez que les permissions de deep linking sont activées

### Problème : Erreur "Module not found" ou problèmes d'imports

**Solution** :
1. Supprimez `node_modules` et réinstallez : `rm -rf node_modules && npm install`
2. Vérifiez que les dépendances du workspace sont installées depuis la racine
3. Redémarrez le serveur Expo : `npm start -- --clear`

### Problème : Le serveur Expo ne démarre pas

**Solution** :
1. Vérifiez que le port 8081 (port par défaut d'Expo) n'est pas utilisé
2. Utilisez un autre port : `expo start --port 8082`
3. Vérifiez les logs pour plus d'informations

### Problème : Erreurs TypeScript

**Solution** :
1. Vérifiez que TypeScript est installé : `npm list typescript`
2. Vérifiez la configuration dans `tsconfig.json`
3. Redémarrez votre IDE/éditeur

## 📚 Ressources

- [Documentation Expo](https://docs.expo.dev/)
- [Documentation React Native](https://reactnative.dev/)
- [Documentation Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentation AREA Backend](../server/README.md)

## 👥 Contribution

Pour contribuer au projet, veuillez consulter le fichier [CONTRIBUTING.md](../../CONTRIBUTING.md) à la racine du projet.

## 📄 Licence

Voir le fichier [LICENSE.md](../../LICENSE.md) pour plus d'informations.
