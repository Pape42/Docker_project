
FROM node:24.22.3-alpine


WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci --omit=dev


COPY . .


EXPOSE 3000


CMD ["node", "server.js"]
