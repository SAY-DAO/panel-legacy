# build environment
FROM registry.say.company/core/nginx:alpine AS prod
RUN apk add curl
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# check every 5s to ensure this service returns HTTP 200
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \ 
    CMD curl -fs http://localhost:80/healthz.html || exit 1

