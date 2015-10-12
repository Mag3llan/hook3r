#!/bin/bash

APP_NAME=${PWD##*/}

VERSION=$(npm view $APP_NAME version)

TAG=quay.io/mag3llan/$APP_NAME:$VERSION

docker build -t $TAG .