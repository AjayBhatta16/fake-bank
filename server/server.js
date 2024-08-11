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

const logIP = (ip, user) => {
    let date = new Date(Date.now())
    let text = ip + ' ' + user + ' ' + date.toString() + '\n'
    fs.appendFile('ip-log.txt', text, err => {
        console.log(err ? err : 'IP Logged successfully')
    })
}

app.post('/user/create', async (req, res) => {
    // Log Request 
    logIP(requestIp.getClientIp(req), req.body.username)
    
    var createResult = await dataEditor.createUser(
        req.body.username,
        `${req.body.firstName} ${req.body.lastName}`,
        req.body.password,
        req.body.email,
        req.body.phoneNumber
    )

    if (createResult.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }

    res.json(createResult)
})

app.post('/user/verify', async (req, res) => {
    // log request 
    logIP(requestIp.getClientIp(req), req.body.username)
    
    var validateResult = await dataEditor.validateLogin(req.body.username, req.body.password)

    if (!validateResult) {
        res.json({
            status: '400',
            msg: 'Invalid username or password'
        })
    }

    if (validateResult.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }

    res.json(token) 
})

app.post('/token/refresh', async (req, res) => {
    // log request 
    logIP(requestIp.getClientIp(req), req.body.username)

    let token = dataEditor.refreshToken(req.body.tokenId)
    if(!token || token.databaseError || token.username != req.body.username) {
        res.json({
            status: '400',
            msg: 'Provided token cannot be refreshed'
        })
    }

    res.json(token)
})

app.post('/token/verify', async (req, res) => {
    // log request
    logIP(requestIp.getClientIp(req), req.body.username)

    let user = await dataEditor.checkAuthToken(req.body.tokenId)
    if (user && user.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    if(!user || user.username != req.body.username) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    res.json(user)
})

app.post('/account/create', (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
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
    }
    if (account.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    res.json(account)
})

app.post('/account/selectall', async (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
    let accountList = await dataEditor.getAllAccountsForUser(req.body.username, req.body.tokenId)
    if (!accountList) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if (accountList.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    res.json({
        data: accountList 
    })
})

app.post('/account/selectone', async (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
    let account = await dataEditor.getAccount(
        req.body.username,
        req.body.tokenId,
        req.body.accountNumber
    )
    if(!account) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(account.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    res.json(account)
})

app.post('/account/delete', async (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
    let accountId = await dataEditor.closeAccount(
        req.body.username,
        req.body.tokenId,
        req.body.accountNumber
    )
    if(!accountId) {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(accountId.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    res.json({
        accountDeleted: accountId
    })
})

app.post('/exchange', async (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
    let transactionRes
    switch(req.body.transactionType) {
        case 'withdraw':
            transactionRes = await dataEditor.withdraw(
                req.body.username,
                req.body.tokenId,
                req.body.from,
                req.body.amount 
            )
            break
        case 'deposit':
            transactionRes = await dataEditor.deposit(
                req.body.username,
                req.body.tokenId,
                req.body.to,
                req.body.amount
            )
            break
        case 'transfer':
            transactionRes = await dataEditor.transfer(
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
    }
    if (transactionRes.databaseError) {
        res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    if(transactionRes == 'bad token') {
        res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(transactionRes == 'no account') {
        res.json({
            status: '400',
            msg: 'Invalid account number'
        })
    }
    res.json({
        status: '200',
        msg: 'Transaction completed successfully' 
    })
})

app.listen(3001)