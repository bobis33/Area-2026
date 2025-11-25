# OAuth 2.0 Actions & Reactions Catalog

This document lists automation capabilities for 5 major services.

- Trigger (Action): The event that starts the scenario.
- Reaction: What the service executes in response.

---

## 1. Discord

Community communication platform.

### Triggers (Actions)

1. **New message in a channel**: Triggered when a message is posted in a specific channel (useful for moderation or logging).
2. **New user joins the server**: Triggered as soon as a member accepts the invitation (useful for welcoming new users).

### Reactions

1. **Send a message**: The bot posts a text message or a rich "Embed" in a defined channel.
2. **Assign a role**: The bot automatically assigns a specific role (e.g., "Verified Member") to a user.

---

## 2. GitHub

Code hosting and version control platform.

### Triggers (Actions)

1. **New "Issue" opened**: Triggered when a bug or task is created in a repository.
2. **New "Star" on the repository**: Triggered when someone stars your project (useful for popularity tracking).

### Reactions

1. **Create an "Issue"**: Automatically create a ticket from an external source (e.g., a bug report form).
2. **Comment on a "Pull Request"**: The bot automatically adds a comment on a pull request (e.g., "Thank you for your contribution!").

---

## 3. Google (Workspace)

Productivity suite (Gmail, Calendar, Drive).

### Triggers (Actions)

1. **New email received (Gmail)**: Triggered when an email matching certain criteria is received (e.g., contains "Invoice").
2. **New event starts (Calendar)**: Triggered X minutes before a meeting starts.

### Reactions

1. **Create a document (Docs/Drive)**: Generate a new Google Doc from a pre-filled template.
2. **Send an email (Gmail)**: Automatically send an email from your Google account.

---

## 4. Microsoft (365)

Office and collaboration suite (Excel, Outlook, Teams).

### Triggers (Actions)

1. **New row in a table (Excel Online)**: Triggered when data is added to an Excel file hosted on OneDrive/SharePoint.
2. **New message (Teams)**: Triggered when you are mentioned or a message arrives in a specific channel.

### Reactions

1. **Create an event (Outlook Calendar)**: Block a time slot in your work calendar.
2. **Add a task (To Do / Planner)**: Create a task with a due date in your task manager.

---

## 5. Spotify

Music and audio streaming platform.

### Triggers (Actions)

1. **New "Liked" track**: Triggered when the user adds a track to their "Liked Songs" library.
2. **New playlist created**: Triggered when the user creates a new public or private playlist.

### Reactions

1. **Add a track to a playlist**: Insert a specific song (via its ID) into an existing playlist.
2. **Pause playback**: Send a command to the player to stop the music (useful if a call comes in, for example).


---

# Version Française

---


# Catalogue d'Actions & Reactions OAuth 2.0

Ce document liste les capacités d'automatisation pour 5 services majeurs.

- Declencheur (Action) : L'evenement qui demarre le scenario.
- Reaction : Ce que le service execute en reponse.

---

## 1. Discord

Plateforme de communication communautaire.

### Declencheurs (Actions)

1. **Nouveau message dans un canal** : Se declenche lorsqu'un message est poste dans un canal specifique (utile pour la moderation ou le logging).
2. **Nouvel utilisateur rejoint le serveur** : Se declenche des qu'un membre accepte l'invitation (utile pour l'accueil).

### Reactions

1. **Envoyer un message** : Le bot poste un message texte ou un "Embed" riche dans un canal defini.
2. **Attribuer un role** : Le bot donne automatiquement un role specifique (ex: "Membre Verifie") a un utilisateur.

---

## 2. GitHub

Hebergement de code et gestion de versions.

### Declencheurs (Actions)

1. **Nouvelle "Issue" ouverte** : Se declenche lorsqu'un bug ou une tache est cree dans un depot.
2. **Nouveau "Star" sur le depot** : Se declenche lorsque quelqu'un met une etoile sur votre projet (utile pour les statistiques de popularite).

### Reactions

1. **Creer une "Issue"** : Creer automatiquement un ticket a partir d'une source externe (ex: un formulaire de rapport de bug).
2. **Commenter une "Pull Request"** : Le bot ajoute un commentaire automatique sur une demande de fusion (ex: "Merci pour ta contribution !").

---

## 3. Google (Workspace)

Suite de productivite (Gmail, Calendar, Drive).

### Declencheurs (Actions)

1. **Nouvel e-mail recu (Gmail)** : Se declenche a la reception d'un e-mail correspondant a certains criteres (ex: contient "Facture").
2. **Nouvel evenement commence (Calendar)** : Se declenche X minutes avant le debut d'une reunion.

### Reactions

1. **Creer un document (Docs/Drive)** : Generer un nouveau fichier Google Doc a partir d'un modele pre-rempli.
2. **Envoyer un e-mail (Gmail)** : Envoyer un e-mail automatique depuis votre adresse Google.

---

## 4. Microsoft (365)

Suite bureautique et collaboration (Excel, Outlook, Teams).

### Declencheurs (Actions)

1. **Nouvelle ligne dans un tableau (Excel Online)** : Se declenche lorsqu'une donnee est ajoutee dans un fichier Excel heberge sur OneDrive/SharePoint.
2. **Nouveau message (Teams)** : Se declenche lorsqu'on vous mentionne ou qu'un message arrive dans un canal specifique.

### Reactions

1. **Creer un evenement (Outlook Calendar)** : Bloquer un creneau dans votre calendrier professionnel.
2. **Ajouter une tache (To Do / Planner)** : Creer une tache avec une date d'echeance dans votre gestionnaire de taches.

---

## 5. Spotify

Streaming musical et audio.

### Declencheurs (Actions)

1. **Nouveau titre "Like" (Sauvegarde)** : Se declenche lorsque l'utilisateur ajoute un titre a sa bibliotheque "Titres likes".
2. **Nouvelle Playlist creee** : Se declenche lorsque l'utilisateur cree une nouvelle liste de lecture publique ou privee.

### Reactions

1. **Ajouter un titre a une Playlist** : Inserer une chanson specifique (via son ID) dans une playlist existante.
2. **Mettre la lecture en pause** : Envoyer une commande au lecteur pour stopper la musique (utile si un appel arrive, par exemple).
