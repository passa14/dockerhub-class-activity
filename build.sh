#!/bin/bash
TAG=v1
DOCKER_HUB=patsa/my-counter-app:${TAG}
docker build -t $DOCKER_HUB my-counter-app
docker push $DOCKER_HUB
