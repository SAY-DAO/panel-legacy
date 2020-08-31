#!/bin/bash

set -e

sh ./scripts/build.sh

docker push $CONTAINER_IMAGE
