# Etapa de desarrollo
FROM node:18.17.0-alpine3.17 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm test
RUN npm run build

# Etapa de producción
FROM node:18.17.0-alpine3.17 AS production
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main"]