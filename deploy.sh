#!/usr/bin/env sh
npm install
(cd client && npm install)
./client/node_modules/serve/bin/serve.js -s build -l 5001
sleep 1
echo $! > .pidfile
