const LoggingUtils = require('../utils/logging-utils')

module.exports = (app, dataEditor) => {
    // RefreshToken
    app.post('/token/refresh', async (req, res) => {
        LoggingUtils.logIP(req, req.body.username)
    
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

    // VerifyAuthToken
    app.post('/token/verify', async (req, res) => {
        LoggingUtils.logIP(req, req.body.username)
    
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
}