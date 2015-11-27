#!/bin/sh


echo "\n########### Begin test.sh ###################"

echo $PWD
echo "ASSERT: Static env: ${STATIC_ENV}"
echo "ASSERT: Print query: ${URL}"
echo "ASYNC_ASSERT: Creating file in secure path.."
echo "${URL}" > "${REPOSITORY_NAME}"


echo "########### End test.sh #####################\n"