const express = require('express')
const cors = require('cors')

const DataEditor = require('./data-editor')

// testing
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

let dataEditor = new DataEditor('./data.json')

require('./functions/status-functions')(app, dataEditor)
require('./functions/user-functions')(app, dataEditor)
require('./functions/auth-token-functions')(app, dataEditor)
require('./functions/bank-account-functions')(app, dataEditor)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
    console.log(`STARTUP: Process listening on port ${PORT}`)
})