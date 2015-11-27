#!/bin/bash

VERSION_TAG=$1

docker run -d \
--name hook3r \
-p 18080:18080 \
-e HOOK3R_SECRET='changeme!!' \
quay.io/mag3llan/hook3r:$VERSION_TAG

