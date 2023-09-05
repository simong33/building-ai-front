FROM node:19.7.0 as build
WORKDIR /building-ai-front

COPY package*.json .
RUN npm install
COPY . .

RUN npm run build
FROM nginx:1.19
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /building-ai-front/build /usr/share/nginx/html