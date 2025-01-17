const LoggingUtils = require('../utils/logging-utils')

module.exports = (app, dataEditor) => {
    // CreateUser
    app.post('/user/create', async (req, res) => {
        console.log('CreateUser: start')
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
        
        var createResult = await dataEditor.createUser(
            req.body.username,
            `${req.body.firstName} ${req.body.lastName}`,
            req.body.password,
            req.body.email,
            req.body.phoneNumber
        )
    
        if (createResult.databaseError) {
            console.log('CreateUser: 500 RESPONSE')
            return res.json({
                status: '500',
                msg: 'An unknown database error has occurred.'
            })
        }
    
        console.log('CreateUser: 200 RESPONSE')
        res.json(createResult)
    })

    // VerifyUserLogin
    app.post('/user/verify', async (req, res) => {
        console.log('VerifyUserLogin: start')
        await LoggingUtils.logIP(req, req.body.username, dataEditor)
        
        var validateResult = await dataEditor.validateLogin(req.body.username, req.body.password)
    
        if (!validateResult) {
            console.log('VerifyUserLogin: 400 RESPONSE')
            return res.json({
                status: '400',
                msg: 'Invalid username or password'
            })
        }
    
        if (validateResult.databaseError) {
            console.log('VerifyUserLogin: 500 RESPONSE')
            return res.json({
                status: '500',
                msg: 'An unknown database error has occurred.'
            })
        }
    
        console.log('VerifyUserLogin: 200 RESPONSE')
        res.json(validateResult) 
    })

    // UserDump
    app.get('/user-dump', async (_, res) => {
        const allUsers = await dataEditor.firestoreRead(
            'users',
            data => data.map(user => {
                return {
                    ...user,
                    id: undefined,
                    accounts: undefined,
                }
            })
        )
        res.json(allUsers)
    })
}