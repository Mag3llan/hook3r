#!/bin/bash

docker run -d \
--name hook3r \
-p 18080:18080 \
-e HOOK3R_SECRET='changeme!!' \
quay.io/mag3llan/hook3r:1.1.1

