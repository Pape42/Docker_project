
Dragon Ball Super - personnages

Cette application web affiche une liste de personnages de Dragon Ball Super (nom, race, univers, technique) et permet d'en ajouter avec un formulaire. Les personnages sont enregistrés dans une base de données PostgreSQL. Adminer permet de voir la base depuis le navigateur.

Important : créer et enregistrer le .env AVANT de lancer docker compose up.
Si la page affiche "Base : non connectée", lancer "docker compose down -v" puis "docker compose up -d".

Prérequis

Il faut seulement installer Docker Desktop.

Créer le fichier .env

Copier le fichier .env.example en .env avec la commande : Copy-Item .env.example .env
Puis ouvrir .env et remplacer a-remplacer par un mot de passe.

Lancer le projet

Lancer la commande : docker compose up -d --build

Les adresses

L'application : http://localhost:3000
Adminer : http://localhost:8080

Se connecter à Adminer

Système : PostgreSQL
Serveur : db
Utilisateur : la valeur de POSTGRES_USER dans le fichier .env
Mot de passe : la valeur de POSTGRES_PASSWORD dans le fichier .env
Base de données : la valeur de POSTGRES_DB dans le fichier .env

Arrêter le projet

docker compose down arrête le projet et garde les données.
docker compose down -v arrête le projet et supprime les données.

Auteurs

Pape Bathily
Xavier Carrier

