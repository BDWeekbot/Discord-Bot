#!/bin/bash

# Generate a unique build timestamp
BUILD_TIME=$(date +%s)

echo "Deploying with consul key version: $BUILD_TIME"

# Set the environment variable and deploy
flyctl deploy --env CONSUL_KEY_VERSION=$BUILD_TIME
