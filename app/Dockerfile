# Image de l'application "Dragon Ball Super" (Node.js + Express).
# La version de Node est figée au patch près : deux constructions de l'image,
# aujourd'hui ou dans six mois, partent exactement de la même base.
FROM node:24.22.3-alpine

# Tout le code vit dans /app à l'intérieur du conteneur.
WORKDIR /app

# Les dépendances d'abord : tant que ces deux fichiers ne changent pas,
# Docker réutilise le cache et ne rejoue pas le "npm ci" ci-dessous.
COPY package.json package-lock.json ./

# "npm ci" installe exactement les versions du package-lock.json.
# --omit=dev : pas les dépendances de développement.
RUN npm ci --omit=dev

# Puis le code de l'application (il change souvent, donc il vient en dernier).
COPY . .

# Documentation du port écouté : il faut quand même le publier avec -p.
EXPOSE 3000

# Forme "exec" : node est le processus n°1 et reçoit le SIGTERM de docker stop.
CMD ["node", "server.js"]
