# Dragon Ball Super - personnages

Application web conteneurisée : une API Node.js/Express qui affiche la liste
des personnages de Dragon Ball Super et permet d'en ajouter via un
formulaire, et une base PostgreSQL qui les conserve. Adminer est fourni pour
consulter la base dans le navigateur. Données fictives, projet d'école.

## Prérequis

Docker Desktop (Docker Compose v2 est inclus). Ni Node ni PostgreSQL n'ont
besoin d'être installés sur la machine.

## Créer le fichier .env

Les identifiants de la base ne sont pas versionnés : il faut créer son propre
`.env` à partir de l'exemple.

```powershell
Copy-Item .env.example .env
```

Puis ouvrir `.env` et remplacer `a-remplacer` par un vrai mot de passe :

```
POSTGRES_USER=dbs
POSTGRES_PASSWORD=...votre mot de passe...
POSTGRES_DB=personnages
```

## Lancer

```bash
docker compose up -d --build
```

| URL | Quoi |
|---|---|
| http://localhost:3000 | l'application |
| http://localhost:8080 | Adminer |

La base met quelques secondes à être prête : l'application réessaie toute
seule, le bandeau passe à « Base : connectée » dès que c'est bon.

## Se connecter à Adminer

Sur http://localhost:8080 :

| Champ | Valeur |
|---|---|
| Système | PostgreSQL |
| Serveur | `db` |
| Utilisateur | la valeur de `POSTGRES_USER` du `.env` |
| Mot de passe | la valeur de `POSTGRES_PASSWORD` du `.env` |
| Base de données | la valeur de `POSTGRES_DB` du `.env` |

La table `personnages` est alors visible dans le schéma `public`.

## Arrêter

```bash
docker compose down      # arrête tout, garde les données
docker compose down -v   # arrête tout et supprime la base
```

## Endpoints

| Méthode | Chemin | Rôle |
|---|---|---|
| GET | `/` | la page web |
| GET | `/api/sante` | état de l'API, de la base, nom du conteneur |
| GET | `/api/personnages` | la liste des personnages |
| POST | `/api/personnages` | ajoute un personnage |

Au premier démarrage, la table `personnages` est créée et remplie avec
5 personnages d'exemple.

## Structure

```
.
├── app/
│   ├── Dockerfile        image de l'application
│   ├── package.json
│   ├── server.js         toute l'application (API + service de la page)
│   └── public/
│       └── index.html    la page web
├── compose.yaml          l'application, PostgreSQL et Adminer
└── .env.example          modèle pour le .env
```

## Auteurs

- Pape Bathily
- Xavier
