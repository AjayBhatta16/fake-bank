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

echo POST /account/create 
echo --------------------------------------------------------------------------------------------------------------------
echo successful run
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"d81d9ef9-32b4-498e-b184-87ad60eaccaf", "type": "checking", "amount": 0}' http://localhost:3001/account/create && echo
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"11b9e1bd-deb6-4d50-aa35-de5d7588ef23", "type": "savings", "amount": 400}' http://localhost:3001/account/create && echo
echo bad token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token", "type": "checking", "amount": 29.99}' http://localhost:3001/account/create && echo

echo POST /account/selectall
echo --------------------------------------------------------------------------------------------------------------------
echo successful run
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"4556b328-a1d2-46e2-b22d-b4e07d65f6b5"}' http://localhost:3001/account/selectall  && echo
echo bad token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token"}' http://localhost:3001/account/selectall && echo

echo POST /account/selectone
echo --------------------------------------------------------------------------------------------------------------------
echo successful run 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"8d742dee-ae2d-4c92-8f6e-d8a95cbd1053", "accountNumber": 20797647}' http://localhost:3001/account/selectone && echo
echo account does not exist 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"8d742dee-ae2d-4c92-8f6e-d8a95cbd1053", "accountNumber": 12345}' http://localhost:3001/account/selectone && echo
echo bad token
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token", "accountNumber": 20797647}' http://localhost:3001/account/selectone && echo

echo POST /account/delete 
echo --------------------------------------------------------------------------------------------------------------------
echo successful run
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"d81d9ef9-32b4-498e-b184-87ad60eaccaf", "accountNumber": 42308879}' http://localhost:3001/account/delete && echo
echo bad token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token", "accountNumber": 20797647}' http://localhost:3001/account/delete && echo

echo POST /exchange 
echo --------------------------------------------------------------------------------------------------------------------
echo successful withdraw
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": 0, "from": 46690979, "transactionType": "withdraw", "amount": 12}' http://localhost:3001/exchange && echo
echo successful deposit
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": 46690979, "from": 0, "transactionType": "deposit", "amount": 12}' http://localhost:3001/exchange && echo
echo successful transfer
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": 42308879, "from": 46690979, "transactionType": "transfer", "amount": 12}' http://localhost:3001/exchange && echo
echo successful ghost transfer 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": null, "from": 42308879, "transactionType": "transfer", "amount": 6}' http://localhost:3001/exchange && echo
echo invalid transactionType 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": 42308879, "from": 46690979, "transactionType": "scam", "amount": 12}' http://localhost:3001/exchange && echo
echo invalid token 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"invalid-token", "to": 42308879, "from": 46690979, "transactionType": "deposit", "amount": 12}' http://localhost:3001/exchange && echo
echo invalid accountNumber 
curl -i -X POST -H 'Content-Type: application/json' -d '{"username": "test1", "tokenId" :"6636de44-220b-4df4-aaf0-87e79e0f4cbc", "to": 42308876, "from": 46690979, "transactionType": "deposit", "amount": 12}' http://localhost:3001/exchange && echo


echo 