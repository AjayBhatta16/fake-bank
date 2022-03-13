const express = require('express')
const cors = require('cors')
const uuid = require('uuid')
const fs = require('fs')
const requestIp = require('request-ip')

const DataEditor = require('./data-editor')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

let dataEditor = new DataEditor('./data.json')

const logIP = ip => {
    fs.appendFile('ip-log.txt', ip + '\n', err => {
        console.log(err ? err : 'IP Logged successfully')
    })
}

app.post('/user/create', (req, res) => {
    logIP(requestIp.getClientIp(req))
    if(!dataEditor.validateNewUser('', req.body.username, req.body.email, req.body.phoneNumber)) {
        res.json({
            status: '400',
            msg: 'A user with this username, email, or phone number already exists'
        })
        return
    }
    let token = false
    while(!token) {
        token = dataEditor.createUser(
            uuid.v4(),
            req.body.username,
            `${req.body.firstName} ${req.body.lastName}`,
            req.body.password,
            req.body.email,
            req.body.phoneNumber
        )
    }
    res.json(token)
})

app.post('/user/verify', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let token = dataEditor.validateLogin(req.body.username, req.body.password)
    if(!token) {
        res.json({
            status: '400',
            msg: 'Invalid username or password'
        })
        return 
    }
    res.json(token) 
})

app.post('/token/refresh', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let token = dataEditor.refreshToken(req.body.tokenId)
    if(!token || token.username != req.body.username) {
        res.json({
            status: '400',
            msg: 'Provided token cannot be refreshed'
        })
        return 
    }
    res.json(token)
})

app.post('/token/verify', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let user = dataEditor.checkAuthToken(req.body.tokenId)
    if(!user || user.username != req.body.username) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return 
    }
    res.json(user)
})

app.post('/account/create', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let account = dataEditor.createAccount(
        req.body.username,
        req.body.tokenId,
        req.body.type,
        req.body.amount 
    )
    if(!account) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return
    }
    res.json(account)
})

app.post('/account/selectall', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let accountList = dataEditor.getAllAccountsForUser(req.body.username, req.body.tokenId)
    if(!accountList) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return
    }
    res.json({
        data: accountList 
    })
})

app.post('/account/selectone', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let account = dataEditor.getAccount(
        req.body.username,
        req.body.tokenId,
        req.body.accountNumber
    )
    if(!account) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return 
    }
    if(!account.accountNumber) {
        res.json({
            status: '400',
            msg: 'Account does not exist'
        })
        return 
    }
    res.json(account)
})

app.post('/account/delete', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let accountId = dataEditor.closeAccount(
        req.body.username,
        req.body.tokenId,
        req.body.accountNumber
    )
    if(!accountId) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return 
    }
    res.json({
        accountDeleted: accountId
    })
})

app.post('/exchange', (req, res) => {
    logIP(requestIp.getClientIp(req))
    let transactionRes
    switch(req.body.transactionType) {
        case 'withdraw':
            transactionRes = dataEditor.withdraw(
                req.body.username,
                req.body.tokenId,
                req.body.from,
                req.body.amount 
            )
            break
        case 'deposit':
            transactionRes = dataEditor.deposit(
                req.body.username,
                req.body.tokenId,
                req.body.to,
                req.body.amount
            )
            break
        case 'transfer':
            transactionRes = dataEditor.transfer(
                req.body.username,
                req.body.tokenId,
                req.body.from,
                req.body.to,
                req.body.amount 
            )
            break
        default:
            res.json({
                status: '400',
                msg: 'invalid transaction type'
            })
            return 
    }
    if(transactionRes == 'bad token') {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
        return 
    }
    if(transactionRes == 'no account') {
        res.json({
            status: '400',
            msg: 'Invalid account number'
        })
        return 
    }
    res.json({
        status: '200',
        msg: 'Transaction completed successfully' 
    })
})

app.listen(3001)