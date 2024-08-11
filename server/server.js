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
        return res.json({
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
        return res.json({
            status: '400',
            msg: 'Invalid username or password'
        })
    }

    if (validateResult.databaseError) {
        return res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }

    res.json(validateResult) 
})

app.post('/token/refresh', async (req, res) => {
    // log request 
    logIP(requestIp.getClientIp(req), req.body.username)

    let token = await dataEditor.refreshToken(req.body.tokenId)

    if(!token) {
        return res.json({
            status: '404',
            msg: 'Provided token id not found'
        })
    }

    if (token.databaseError) {
        return res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }

    if (token.expired) {
        return res.json({
            status: '401',
            msg: 'Provided token id exists but is expired.'
        })
    }

    if (token.username != req.body.username) {
        return res.json({
            status: '400',
            msg: 'Provided username does not match provided token'
        })
    }

    res.json(token)
})

app.post('/token/verify', async (req, res) => {
    // log request
    logIP(requestIp.getClientIp(req), req.body.username)

    let user = await dataEditor.checkAuthToken(req.body.tokenId)
    if (user && user.databaseError) {
        return res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    if (!user) {
        return res.json({
            status: '404',
            msg: 'provided token id not found'
        })
    }
    if (user.username != req.body.username) {
        return res.json({
            status: '400',
            msg: 'Provided username does not match token'
        })
    }
    res.json(user)
})

app.post('/account/create', async (req, res) => {
    logIP(requestIp.getClientIp(req), req.body.username)
    let account = await dataEditor.createAccount(
        req.body.username,
        req.body.tokenId,
        req.body.type,
        req.body.amount 
    )
    if(!account) {
        return res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if (account.databaseError) {
        return res.json({
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
        return res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if (accountList.databaseError) {
        return res.json({
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
        return res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(account.databaseError) {
        return res.json({
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
        return res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(accountId.databaseError) {
        return res.json({
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
            return res.json({
                status: '400',
                msg: 'invalid transaction type'
            })
    }
    if (transactionRes.databaseError) {
        return res.json({
            status: '500',
            msg: 'An unknown database error has occurred.'
        })
    }
    if(transactionRes == 'bad token') {
        return res.json({
            status: '400',
            msg: 'Provided token is not valid'
        })
    }
    if(transactionRes == 'no account') {
        return res.json({
            status: '400',
            msg: 'Invalid account number'
        })
    }
    res.json({
        status: '200',
        msg: 'Transaction completed successfully' 
    })
})

const PORT = process.env.PORT | 3001
app.listen(PORT, () => {
    console.log(`Process listening on port ${PORT}`)
})