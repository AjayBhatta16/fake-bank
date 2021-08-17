#!/bin/bash

echo POST /user/create
echo --------------------------------------------------------------------------------------------------------------------
echo successful runs
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "firstName": "Joe", "lastName": "Smith", "email": "joesmith@email.com", "phoneNumber": "1234567890", "password": "abcd1234"}' http://localhost:3001/user/create
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test2", "firstName": "Mark", "lastName": "Sanchez", "email": "buttfumble@email.com", "phoneNumber": "4371934199", "password": "abcd1234"}' http://localhost:3001/user/create
echo duplicate email
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test3", "firstName": "Joe", "lastName": "Smith", "email": "joesmith@email.com", "phoneNumber": "2394829048", "password": "abcd1234"}' http://localhost:3001/user/create
echo duplicate phone
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test4", "firstName": "Joe", "lastName": "Montana", "email": "joemontana@email.com", "phoneNumber": "1234567890", "password": "abcd1234"}' http://localhost:3001/user/create
echo duplicate username
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "firstName": "Joe", "lastName": "Smith", "email": "joesmith2@email.com", "phoneNumber": "1234567891", "password": "abcd1234"}' http://localhost:3001/user/create

echo GET /user/verify 
echo --------------------------------------------------------------------------------------------------------------------
echo successful login with username 
curl -i -X GET http://localhost:3001/user/verify?username=test1&password=abcd1234 
echo successful login with email 
curl -i -X GET http://localhost:3001/user/verify?username=joesmith%40email.com&password=abcd1234 
echo successful login with phone 
curl -i -X GET http://localhost:3001/user/verify?username=1234567890&password=abcd1234 
echo unsuccessful login attempt
curl -i -X GET http://localhost:3001/user/verify?username=test1&password=incorrect 


echo 