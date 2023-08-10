FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm test
RUN npm run build

FROM node:18-alpine AS production
EXPOSE 3800
EXPOSE 3100
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "dist/main"]