#!/bin/sh


echo "\n########### Begin test.sh ###################"

echo $PWD
echo "ASSERT: Static env: ${STATIC_ENV}"
echo "ASSERT: Print query: ${URL}"
echo "ASSERT: JsonQuery. First key from object. Value: ${NEW_TAG}"
echo "ASSERT: JsonQuery. Piping Functions. Value: ${ENVIRONMENT}"
echo "ASSERT: JsonQuery. First array. Value: ${FIRST_FROM_ARRAY}"
echo "ASYNC_ASSERT: Creating file in secure path.."
echo "${URL}" > "${REPOSITORY_NAME}"


echo "########### End test.sh #####################\n"