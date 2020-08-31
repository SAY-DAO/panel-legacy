# build environment
FROM nginx:alpine AS prod
COPY . /usr/share/nginx/html

