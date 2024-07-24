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
EXPOSE 3200
RUN apk add --no-cache openrc nginx curl net-tools iproute2
COPY ./config/nginx.conf /etc/nginx/nginx.conf
COPY ./config/boot.sh ./usr/src/boot.sh
RUN chmod +x ./usr/src/boot.sh
RUN cp /etc/rc.conf /etc/rc.conf.bk
RUN echo 'rc_provide="loopback net"' >> /etc/rc.conf
RUN openrc && touch /run/openrc/softlevel
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build /usr/src/app/dist ./dist
CMD ["sh", "./../boot.sh"]
