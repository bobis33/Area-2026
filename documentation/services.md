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
