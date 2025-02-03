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

        await dataEditor.createUserETL(user)

        const numAccounts = Math.min(req.numAccounts ?? 3, 15)
        const numTransactions = Math.min(req.numTransactions ?? 100, 500)

        for (let i = 0; i < numAccounts; i++) {
            const account = FakerUtils.createBankAccount(user.username)
            await dataEditor.createAccountETL(account)
        }

        user = await dataEditor.validateLogin(user.username, user.password, true)
        
        for (let i = 0; i < numTransactions; i++) {
            const transaction = FakerUtils.createTransaction(user)
            await dataEditor.createTransactionETL(transaction)
        }

        user = await dataEditor.validateLogin(user.username, user.password, true)

        res.status(200).json(user)
    })
}