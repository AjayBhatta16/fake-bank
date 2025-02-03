const FakerUtils = require('../utils/faker-utils')

module.exports = (app, dataEditor) => {
    // ProcessETLBatch
    app.post('/etl/upload', async (req, res) => {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' })
        }

        try {
            const json = JSON.parse(req.file.buffer.toString())

            const users = json.users 
            const accounts = json.accounts
            const transactions = json.transactions

            const badDataErrors = []

            users.forEach(async (user) => {
                try {
                    dataEditor.createUserETL(user)
                } catch (error) {
                    badDataErrors.push({
                        error,
                        item: user,
                    })
                }
            })

            accounts.forEach(async (account) => {
                try {
                    dataEditor.createAccountETL(account)
                } catch (error) {
                    badDataErrors.push({
                        error,
                        item: account,
                    })
                }
            })

            transactions.forEach(async (transaction) => {
                try {
                    dataEditor.createTransactionETL(transaction)
                } catch (error) {
                    badDataErrors.push({
                        error,
                        item: transaction,
                    })
                }
            })

            res.status(200).json({
                users,
                accounts,
                transactions,
                badDataErrors,
            })
        } catch (error) {
            res.status(400).json(error)
        }
    })

    // CreateNewUser 
    app.post('/etl/new-user', async (req, res) => {
        let user = FakerUtils.createFakeUser()
        user.id = (await dataEditor.generateNewUUID('users')).value

        const numAccounts = Math.min(req.numAccounts ?? 3, 15)
        const numTransactions = Math.min(req.numTransactions ?? 100, 500)

        for (let i = 0; i < numAccounts; i++) {
            const account = FakerUtils.createBankAccount(user.username)
            account.accountNumber = dataEditor.generateNewAccountID(user)
            user.accounts.push(account)
        }
        
        for (let i = 0; i < numTransactions; i++) {
            const transaction = FakerUtils.createTransaction(user)
            user = dataEditor.appendTransaction(user, transaction)
        }

        await dataEditor.createUserETL(user)

        res.status(200).json(user)
    })
}