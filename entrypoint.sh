#!/bin/bash

echo $MONGO_PASSWD

python --version || true
python3 --version || true

which python || true
which python3 || true

exec "$@"