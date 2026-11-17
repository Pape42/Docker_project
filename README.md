# Dragon Ball Super - personnages

Petite application web conteneurisée : une API Node.js/Express qui liste et
enregistre des personnages, et une base PostgreSQL. Données fictives, projet
d'école.

## Prérequis

- Docker Desktop (ou Docker Engine) avec Docker Compose v2
- Rien d'autre : ni Node, ni PostgreSQL installés sur la machine

## Lancer

```bash
docker compose up -d --build
```

Puis ouvrir http://localhost:3000

La base met quelques secondes à être prête : l'application attend son
healthcheck avant de démarrer.

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

```bash
curl localhost:3000/api/sante

curl -X POST localhost:3000/api/personnages \
  -H "Content-Type: application/json" \
  -d '{"nom":"Freezer","race":"Frost Demon","univers":7,"technique":"Death Beam"}'
```

Au premier démarrage, la table `personnages` est créée et remplie avec
5 personnages d'exemple.

## Structure

```
.
├── app/
│   ├── Dockerfile        image de l'application (node:24.22.3-alpine)
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js         toute l'application (API + service de la page)
│   └── public/
│       └── index.html    la page web
└── docker-compose.yml    l'application + PostgreSQL
```

## Configuration

L'application ne contient aucun mot de passe : elle lit les variables
d'environnement fournies par Compose.

| Variable | Valeur par défaut | Rôle |
|---|---|---|
| `PORT` | `3000` | port d'écoute de l'application |
| `PGHOST` | `db` | nom du service PostgreSQL |
| `PGPORT` | `5432` | port de PostgreSQL |
| `PGUSER` | `dbs` | utilisateur |
| `PGPASSWORD` | `dbs` | mot de passe |
| `PGDATABASE` | `dbs` | nom de la base |

Les données vivent dans le volume nommé `db-data`, elles survivent donc à un
`docker compose down`.

## Si ça ne marche pas

| Symptôme | Cause probable |
|---|---|
| `/api/sante` répond `base: non connectée` | la base démarre encore, attendre quelques secondes |
| port 3000 déjà utilisé | changer le port publié dans `docker-compose.yml` (`"8080:3000"`) |
| la base refuse de démarrer après un changement de version de PostgreSQL | `docker compose down -v` puis relancer (les données sont perdues) |
