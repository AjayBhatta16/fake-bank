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
                user.accounts = []
            })

            accounts.forEach(async (account) => {
                account.transactions = []

                const user = users.find(user => user.username === account.username)
                
                if (!!user) {
                    user.accounts.push(account)
                } else {
                    badDataErrors.push(
                        `Uploaded account #${account.accountNumber} does not belong to an uploaded user.`
                    )
                }
            })

            transactions.forEach(async (transaction) => {
                const user = users.find(user =>
                    user.accounts.some(acc => 
                        acc.accountNumber === transaction.toAccount 
                        || acc.accountNumber === transaction.fromAccount
                    )
                )

                if (!!user) {
                    dataEditor.appendTransaction(user, transaction)
                } else {
                    badDataErrors.push(
                        `Uploaded transaction from ${transaction.fromAccount} to ${transaction.toAccount} contains at least one unknown account number.`
                    )
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