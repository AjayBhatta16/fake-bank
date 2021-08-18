#!/bin/bash
# NOTE: THESE TESTS ARE NOT INTENDED TO BE RUN ALL AT ONCE
#       IF YOU RUN THIS SHELL SCRIPT, SOME OF THE TESTS WILL FAIL
# req template: 
# curl -i -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:3001

echo POST /user/create
echo --------------------------------------------------------------------------------------------------------------------
echo successful runs
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "firstName": "Joe", "lastName": "Smith", "email": "joesmith@email.com", "phoneNumber": "1234567890", "password": "abcd1234"}' http://localhost:3001/user/create && echo
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test2", "firstName": "Mark", "lastName": "Sanchez", "email": "buttfumble@email.com", "phoneNumber": "4371934199", "password": "abcd1234"}' http://localhost:3001/user/create && echo
echo duplicate email
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test3", "firstName": "Joe", "lastName": "Smith", "email": "joesmith@email.com", "phoneNumber": "2394829048", "password": "abcd1234"}' http://localhost:3001/user/create && echo
echo duplicate phone
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test4", "firstName": "Joe", "lastName": "Montana", "email": "joemontana@email.com", "phoneNumber": "1234567890", "password": "abcd1234"}' http://localhost:3001/user/create && echo
echo duplicate username
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "firstName": "Joe", "lastName": "Smith", "email": "joesmith2@email.com", "phoneNumber": "1234567891", "password": "abcd1234"}' http://localhost:3001/user/create && echo

echo POST /user/verify 
echo --------------------------------------------------------------------------------------------------------------------
echo successful login with username 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "password": "abcd1234"}' http://localhost:3001/user/verify && echo
echo successful login with email 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "joesmith@email.com", "password": "abcd1234"}' http://localhost:3001/user/verify && echo
echo successful login with phone 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "1234567890", "password": "abcd1234"}' http://localhost:3001/user/verify && echo
echo unsuccessful login attempt
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "password": "incorrect"}' http://localhost:3001/user/verify && echo

echo POST /token/refresh 
echo --------------------------------------------------------------------------------------------------------------------
echo successful run 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"8c4ac4a3-1394-4e3a-ad7e-500920e6871b"}' http://localhost:3001/token/refresh  && echo
echo invalid token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token"}' http://localhost:3001/token/refresh && echo
echo expired token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"2b819ee6-b001-41ad-be6a-f2319241ec6c"}' http://localhost:3001/token/refresh  && echo

echo POST /token/verify 
echo --------------------------------------------------------------------------------------------------------------------
echo successful run 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"523cc1da-28ca-4c1d-a92b-e72412cd0577"}' http://localhost:3001/token/verify  && echo
echo invalid token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token"}' http://localhost:3001/token/verify && echo
echo expired token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"2b819ee6-b001-41ad-be6a-f2319241ec6c"}' http://localhost:3001/token/verify  && echo


echo 