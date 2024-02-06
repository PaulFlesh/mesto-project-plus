#!/bin/bash
SSH_CONFIG="${1}"
PROJECT_PATH="${2}"
scp -i "C:\Users\M2entertainment/.ssh/id_ed25519_yacloud" -Cr .env "$SSH_CONFIG:${PROJECT_PATH}/current"