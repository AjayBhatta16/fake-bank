const fs = require('fs')
const uuid = require('uuid')

class DataEditor {
    constructor(dataFile) {
        this.dataFile = dataFile
        this.data = ''
        this.openDataFile()
    }
    openDataFile() {
        fs.readFile(this.dataFile, (err, data) => {
            if(err) throw err
            this.data = JSON.parse(data)
        })
    }
    save() {
        fs.writeFile(this.dataFile, JSON.stringify(this.data), err => {
            if(err) console.log(err)
        })
    }
    encryptPassword(password) {
        let charList = password.split('')
        charList.forEach(ch => {
            ch = ch.charCodeAt(0)
        })
        return charList.join('-')
    }
    validateNewUser(id, username, email, phoneNumber) {
        let conflictingUsers = this.data.users.filter(user => (
            user.id == id
            || user.username == username
            || user.email == email
            || user.phoneNumber == phoneNumber
        ))
        return conflictingUsers.length == 0
    }
    createUser(id, username, fullName, password, email, phoneNumber) {
        if(!this.validateNewUser(id, username, email, phoneNumber)) {
            return false 
        }
        let userObj = {
            id: id,
            username: username,
            fullName: fullName,
            password: this.encryptPassword(password),
            email: email,
            phoneNumber: phoneNumber,
            accounts: []
        }
        this.data.users.push(userObj)
        this.save()
        return this.generateAuthToken(username)
    }
    validateLogin(username, password) {
        let validUsers = this.data.users.filter(user => (
            (
                user.username == username 
                || user.email == username
                || user.phoneNumber == username
            )
            && user.password == this.encryptPassword(password)
        ))
        return validUsers.length == 1 ? this.generateAuthToken(username) : false
    }
    validateNewUUID(id) {
        return !this.data.authTokens.some(token => token.id == id)
    }
    generateNewUUID() {
        let id = uuid.v4()
        if(!this.validateNewUUID(id)) {
            return this.generateNewUUID()
        }
        return id 
    }
    generateAuthToken(username) {
        let id = this.generateNewUUID()
        let expDate = new Date(Date.now())
        expDate.setHours(expDate.getHours() + 1)
        let token = {
            username: username,
            id: id,
            expirationDate: expDate
        }
        this.data.authTokens.push(token)
        this.save()
        return token 
    }
    cleanTokens() {
        this.data.authTokens = this.data.authTokens.filter(token => token.expirationDate.getTime() <= Date.now())
        this.save()
    }
    refreshToken(tokenId) {
        let token = (this.data.authTokens.filter(token => token.id == tokenId))[0]
        if(!token || token.expirationDate.getTime() < Date.now()) {
            this.cleanTokens()
            return false
        }
        token.id = this.generateNewUUID()
        token.expDate.setHours(token.expDate.getHours() + 1)
        this.save()
        return token 
    }
    checkAuthToken(tokenId) {
        let token = this.data.authTokens.filter(token => token.id == tokenId)[0]
        if(!token || token.expirationDate.getTime() < Date.now()) {
            this.cleanTokens()
            return false
        }
        return this.data.users.filter(user => user.username == token.username)
    }
    getAllAccountsForUser(username, tokenId) {
        if(this.checkAuthToken(tokenId) != username) {
            return false
        }
        return this.data.users.filter(user => user.username == username)[0].accounts
    }
    getAccount(username, tokenId, accountNumber) {
        if(this.checkAuthToken(tokenId) != username) {
            return false
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        let account = user.accounts.filter(acc => acc.accountNumber == accountNumber)[0]
        return account ? account : {}
    }
    validateNewAccount(username, id) {
        let user = this.data.users.filter(user => user.username == username)[0]
        return !user.accounts.some(acc => acc.id == id)
    }
    createAccount(username, tokenId, accountType, amount) {
        if(this.checkAuthToken(tokenId) != username) {
            return false 
        }
        let id = Math.floor(Math.random() * 99999999)
        if(!this.validateNewAccount(username, id)) {
            return this.createAccount(username, tokenId, accountType, amount)
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        let account = {
            accountNumber: id,
            owner: user.id,
            accountType: accountType,
            amount: amount 
        }
        user.accounts.push(account)
        this.save()
        return account 
    }
    closeAccount(username, tokenId, accountId) {
        if(this.checkAuthToken(tokenId) != username) {
            return false
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        user.accounts = user.accounts.filter(acc => acc.accountNumber == accountId)
        this.save()
        return accountId
    }
    transfer(username, tokenId, fromAccountId, toAccountId, amount) {
        if(this.checkAuthToken(tokenId) != username) {
            return 'bad token'
        }
        let returnMsg = this.withdraw(username, tokenId, fromAccountId, amount)
        this.deposit(username, tokenId, toAccountId, amount) 
        return returnMsg
    }
    deposit(username, tokenId, accountId, amount) {
        if(this.checkAuthToken(tokenId) != username) {
            return 'bad token'
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        let account = user.accounts.filter(acc => acc.accountNumber == accountId)[0]
        if(!account) return 'no account'
        account.amount += amount
        this.save()
        return 'success'
    }
    withdraw(username, tokenId, accountId, amount) {
        if(this.checkAuthToken(tokenId) != username) {
            return 'bad token'
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        let account = user.accounts.filter(acc => acc.accountNumber == accountId)[0]
        if(!account) return 'no account'
        account.amount -= amount
        this.save()
        return 'success'
    }
}

module.exports = DataEditor