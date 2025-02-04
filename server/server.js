const express = require('express')
const cors = require('cors')
const path = require('path');

const DataEditor = require('./data-editor')

// testing 2
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

let dataEditor = new DataEditor('./data.json')

require('./functions/status-functions')(app, dataEditor)
require('./functions/user-functions')(app, dataEditor)
require('./functions/auth-token-functions')(app, dataEditor)
require('./functions/bank-account-functions')(app, dataEditor)
require('./functions/etl-pipeline-functions')(app, dataEditor)
require('./functions/dashboard-functions')(app)

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
    console.log(`STARTUP: Process listening on port ${PORT}`)
})