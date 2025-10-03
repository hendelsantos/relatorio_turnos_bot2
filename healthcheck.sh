#!/bin/bash

# Script de healthcheck para Railway
# Verifica se a aplicação está respondendo

curl -f http://localhost:$PORT/api/turnos || exit 1