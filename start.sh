#!/bin/bash
# starts fake-bank in the background with client side on port 3000 and server on port 3001
cd client
npm run start &
cd ../server
node server.js &
