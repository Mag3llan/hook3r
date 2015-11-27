#!/bin/bash

APP_NAME=${PWD##*/}

#VERSION=$(npm view $APP_NAME version)
VERSION=$1

TAG=quay.io/mag3llan/$APP_NAME:$VERSION

docker build --no-cache -t $TAG .