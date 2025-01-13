const fs = require('fs')
const requestIp = require('request-ip')

const logIP = async (request, user, dataEditor) => {
    console.log('logIP: start')
    let ip = requestIp.getClientIp(request)
    await dataEditor.logActivity(ip, user, "")
}

module.exports = {
    logIP
}