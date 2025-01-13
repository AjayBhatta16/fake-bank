const LoggingUtils = require('../utils/logging-utils')

module.exports = (app, dataEditor) => {
    // CreateBankAccount
    app.post('/account/create', async (req, res) => {
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
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
    
    // GetBankAccounts
    app.post('/account/selectall', async (req, res) => {
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
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
    
    // GetBankAccount
    app.post('/account/selectone', async (req, res) => {
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
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
    
    // DeleteBankAccount
    app.post('/account/delete', async (req, res) => {
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
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
    
    // ProcessTransaction
    app.post('/exchange', async (req, res) => {
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
        let transactionRes
        switch(req.body.transactionType) {
            case 'withdraw':
                transactionRes = await dataEditor.withdraw(
                    req.body.username,
                    req.body.tokenId,
                    req.body.from,
                    req.body.amount,
                    req.body.note
                )
                break
            case 'deposit':
                transactionRes = await dataEditor.deposit(
                    req.body.username,
                    req.body.tokenId,
                    req.body.to,
                    req.body.amount,
                    req.body.note
                )
                break
            case 'transfer':
                console.log("wire transfer")
                transactionRes = await dataEditor.transfer(
                    req.body.username,
                    req.body.tokenId,
                    req.body.from,
                    req.body.to,
                    req.body.amount,
                    req.body.note,
                    req.body.wireTransfer
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
}