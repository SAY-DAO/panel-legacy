# build environment
FROM nginx:alpine AS prod
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

