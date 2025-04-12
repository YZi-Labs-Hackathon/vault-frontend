#!/bin/bash

# Check if .env.development.local does not exist and .env.local.example exists
if [ ! -f ".env.development.local" ] && [ -f ".env.local.example" ]; then
    # Copy .env.local.example to .env
    cp .env.local.example .env.development.local
    echo ".env.local.example has been copied to .env.development.local"
fi
