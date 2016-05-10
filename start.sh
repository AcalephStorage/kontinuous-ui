#!/bin/sh

if [ -f $KUBERNETES_API_TOKEN_PATH ]; then
  export KUBERNETES_API_TOKEN=$(<$KUBERNETES_API_TOKEN_PATH)
fi

ember build -prod
