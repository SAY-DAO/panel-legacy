#!/bin/bash

set -e

docker pull $CONTAINER_IMAGE || true
docker build \
    --build-arg ENVIRONMENT=$ENVIRONMENT \
    --cache-from $CONTAINER_IMAGE \
    --target prod \
    -t $CONTAINER_IMAGE \
    .
