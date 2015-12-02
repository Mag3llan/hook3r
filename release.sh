#!/bin/bash

VERSION_TAG=$1

docker tag quay.io/mag3llan/hook3r:$VERSION_TAG quay.io/mag3llan/hook3r:latest
docker push quay.io/mag3llan/hook3r:latest

npm publish
