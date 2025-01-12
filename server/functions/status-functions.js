const fs = require('fs')

module.exports = (app) => {
    // CheckBaseURL
    app.get('/', (_, res) => {
        console.log('CheckBaseURL')
        res.status(200).send('OK')
    })

    // GetConfigStatus
    app.get('/status', async (_, res) => {
        console.log('GetConfigStatus: start')
        const dbKeyPresent = fs.existsSync('secrets/serviceAccountKey.json')
        res.send(`
            API: Running
            Database Config Files: ${dbKeyPresent ? 'Present' : 'Missing'}`
        )
    })

    // HealthCheck
    app.get('/health-check', (_, res) => {
        console.log('HEALTH CHECK')
        res.json({
            status: '200',
            message: 'OK'
        })
    })
    
    // LogDump
    app.get('/log-dump', async (_, res) => {
        const logFileExists = fs.existsSync('./ip-log.txt')
        if (logFileExists) {
            res.sendFile('./ip-log.txt', { root: __dirname })
        } else {
            res.send("no logs found")
        }
    })
}