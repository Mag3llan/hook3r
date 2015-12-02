#!/bin/bash

VERSION_TAG=$1

docker run -d \
--name hook3r \
-p 18080:18080 \
-e HOOK3R_SECRET='ChangeMe!!' \
-e HOOK3R_PATH="/resources" \
-v ~/Workspace/hook3r/test/resources:/resources \
quay.io/mag3llan/hook3r:$VERSION_TAG

