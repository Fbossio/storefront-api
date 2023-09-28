#!/bin/sh

NODE_ENV=test npx ts-node src/server.ts &

SERVER_PID=$!

sleep 15

npm run migrate-test:up
NODE_ENV=test npx jasmine-ts

kill -9 $SERVER_PID
