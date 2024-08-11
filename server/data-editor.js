const fs = require('fs')
const uuid = require('uuid')

const firebaseAdmin = require("firebase-admin")

const firestoreServiceAccountKey = require("./secrets/serviceAccountKey.json")

class DataEditor {
    // initialization
    constructor() {
        this.initFirestore()
    }
    initFirestore() {
        initializeApp({
            credential: firebaseAdmin.credential.cert(firestoreServiceAccountKey),
        })
        this.db = firebaseAdmin.firestore()
    }

    // firestore CRUD handlers
    async firestoreCreate(collectionName, data, callback) {
        try {
            const docRef = await this.db.collection(collectionName).add(data)
            return callback(data)
        } catch (error) {
            console.log(error)
            return { databaseError: true }
        }
    }
    async firestoreRead(collectionName, callback) {
        try {
            const snapshot = await this.db.collection(collectionName).get()
            const data = snapshot.docs.map(doc => doc.data())
            return callback(data)
        } catch (error) {
            console.log(error)
            return { databaseError: true }
        }
    }
    async firestoreUpdate(collectionName, id, newData) {
        try {
            const snapshot = await this.db.collection(collectionName).where('id', '==', id).get()
            if (snapshot.empty) {
                return false 
            }
            snapshot.forEach(async (doc) => {
                await doc.ref.update(newData);
            });
        } catch (error) {
            console.log(error)
            return { databaseError: true }
        }
    }

    /** 
     * REST Operation: POST /account/create
    */
    async validateNewUser(username, email, phoneNumber) {
        return await this.firestoreRead(
            'users',
            data => this.validateNewUserBase(username, email, phoneNumber, data)
        )
    }
    validateNewUserBase(username, email, phoneNumber, data) {
        let conflictingUsers = data.filter(user => (
            user.username == username
            || user.email == email
            || user.phoneNumber == phoneNumber
        ))
        return conflictingUsers.length == 0
    }
    async createUser(username, fullName, password, email, phoneNumber) {
        // validate data uniqueness
        const validateResult = await this.validateNewUser(username, email, phoneNumber)
        if (!validateResult) {
            return {
                errorMessage: "An account with this username, email, or phone number already exists."
            } 
        }
        if (validateResult.databaseError) {
            return { databaseError: true }
        }
        // generate ID
        const newIDResult = await this.generateNewUUID('users')
        if (newIDResult.databaseError) {
            return { databaseError: true }
        }
        // create new data
        let userObj = {
            id: newIDResult.value,
            username: username,
            fullName: fullName,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            accounts: []
        }
        const createResult = await this.firestoreCreate('users', userObj, data => data)
        if (createResult.databaseError) {
            return { databaseError: true } 
        }
        // create an auth token for the user
        const token = await this.generateAuthToken(username)
    }

    /**  
     * REST Operation: /user/verify
     */
    async validateLogin(username, password) {
        const readResult = await this.firestoreRead(
            'users',
            async (data) => await this.validateLoginBase(username, password, data)
        )
        if (readResult === undefined) {
            return false 
        }
        if (readResult.databaseError) {
            return { databaseError: true }
        }
        return await this.generateAuthToken(readResult.username)
    }
    async validateLoginBase(username, password, data) {
        let validUsers = data.users.filter(user => (
            (
                user.username == username 
                || user.email == username
                || user.phoneNumber == username
            )
            && user.password == password
        ))
        return validUsers[0]
    }

    /**  
     * Unique ID Helpers
     */
    async validateNewUUID(id, collectionName) {
        return await this.firestoreRead(
            collectionName,
            data => this.validateNewUUIDBase(id, data)
        )
    }
    validateNewUUIDBase(id, data) {
        return !data.some(token => token.id == id)
    }
    async generateNewUUID(collectionName) {
        let id = uuid.v4()
        const validateResult = await this.validateNewUUID(id, collectionName)
        if (!validateResult) {
            return await this.generateNewUUID(collectionName)
        }
        if (validateResult.databaseError) {
            return validateResult
        }
        return {
            value: id
        }
    }
    async generateAuthToken(username) {
        let newIDResult = await this.generateNewUUID('auth_tokens')
        if (newIDResult.databaseError) {
            return { databaseError: true }
        }
        let expDate = new Date(Date.now())
        expDate.setHours(expDate.getHours() + 1)
        let token = {
            username: username,
            id: newIDResult.value,
            expirationDate: expDate.getTime()
        }
        const createResult = await this.firestoreCreate('auth_tokens', token, token => token)
        if (createResult.databaseError) {
            return { databaseError: true }
        }
        return token
    }
    
    /** 
     * REST Operation: POST /token/refresh
     */
    async refreshToken(tokenId) {
        const readResult = await this.firestoreRead(
            'auth_tokens',
            (data) => this.refreshTokenBaseRead(tokenId, data)
        )
        if (!readResult) {
            return false;
        }
        if (readResult.databaseError) {
            return { databaseError: true }
        }
        const id = await this.generateNewUUID('auth_tokens')
        const newToken = this.refreshTokenBaseUpdate(readResult, id)
        const updateResult = this.firestoreUpdate(
            'auth_tokens', tokenId, newToken
        )
        return updateResult
    }
    refreshTokenBaseRead(tokenId, data) {
        var token = (data.filter(token => token.id == tokenId))[0]
        let tokenDate = token ? new Date(token.expirationDate) : null 
        if(!token || tokenDate.getTime() < Date.now()) {
            return false
        }
        return token
    }
    refreshTokenBaseUpdate(token, id) {
        let tokenDate = new Date(token.expirationDate)
        tokenDate.setHours(tokenDate.getHours() + 1)
        token.expirationDate = tokenDate.getTime()
        token.id = id
        return token
    }

    /**  
     * REST Operation: POST /token/verify
     */
    async checkAuthToken(tokenId) {
        const readTokenResult = await this.firestoreRead(
            'auth_tokens', 
            data => this.checkAuthTokenBase(tokenId, data)
        )
        if (!readTokenResult) {
            return false 
        }
        if (readTokenResult.databaseError) {
            return { databaseError: true }
        }
        const readUserResult = await this.firestoreRead(
            'users',
            data => this.checkAuthTokenUser(readTokenResult.username, data) 
        )
        if (readUserResult.databaseError) {
            return { databaseError: true }
        }
        return readUserResult
    }
    checkAuthTokenBase(tokenId, data) {
        let token = (data.filter(token => token.id == tokenId))[0]
        let tokenDate = token ? new Date(token.expirationDate) : null 
        if(!token || tokenDate.getTime() < Date.now()) {
            return null
        }
        return token 
    }
    checkAuthTokenUser(username, data) {
        return data.filter(user => user.username == username)
    }

    /**  
     * REST Operation: /account/selectall
     */
    getAllAccountsForUser(username, tokenId) {
        if(this.checkAuthToken(tokenId).username != username) {
            return false
        }
        return (this.data.users.filter(user => user.username == username))[0].accounts
    }

    /**  
     * REST Operation: /account/selectone
     */
    getAccount(username, tokenId, accountNumber) {
        if(this.checkAuthToken(tokenId).username != username) {
            return false
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        let account = user.accounts.filter(acc => acc.accountNumber == accountNumber)[0]
        return account ? account : {}
    }

    /**  
     * REST Operation: /account/create
     */
    validateNewAccount(username, id) {
        let user = this.data.users.filter(user => user.username == username)[0]
        return !user.accounts.some(acc => acc.id == id)
    }
    createAccount(username, tokenId, accountType, amount) {
        if(this.checkAuthToken(tokenId).username != username) {
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

    /**  
     * REST Operation: /account/delete
     */
    closeAccount(username, tokenId, accountId) {
        if(this.checkAuthToken(tokenId).username != username) {
            return false
        }
        let user = this.data.users.filter(user => user.username == username)[0]
        user.accounts = user.accounts.filter(acc => acc.accountNumber != accountId)
        this.save()
        return accountId
    }

    /**  
     * REST Operation: /exchange
     */
    transfer(username, tokenId, fromAccountId, toAccountId, amount) {
        if(this.checkAuthToken(tokenId).username != username) {
            return 'bad token'
        }
        let returnMsg = this.withdraw(username, tokenId, fromAccountId, amount)
        this.deposit(username, tokenId, toAccountId, amount) 
        return returnMsg
    }
    deposit(username, tokenId, accountId, amount) {
        if(this.checkAuthToken(tokenId).username != username) {
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
        if(this.checkAuthToken(tokenId).username != username) {
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