const fs = require('fs')
const requestIp = require('request-ip')

const logIP = (request, user) => {
    console.log('logIP: start')
    let ip = requestIp.getClientIp(request)
    let date = new Date(Date.now())
    let text = ip + ' ' + user + ' ' + date.toString() + '\n'
    fs.appendFile('../ip-log.txt', text, err => {
        console.log(err ? err : 'IP Logged successfully')
    })
}

module.exports = {
    logIP
}