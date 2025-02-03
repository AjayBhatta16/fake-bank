const faker = require("@faker-js/faker").faker

const createFakeUser = () => {
    return {
        username: faker.internet.userName(),
        fullName: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
    }
}

const createBankAccount = (username) => {
    return {
        username,
        accountType: faker.helpers.arrayElement(["checking", "savings"]),
        amount: parseFloat(faker.finance.amount(10, 10000000, 2)),
    }
}

const createTransaction = (user) => {
    const username = user.username

    const type = faker.helpers.arrayElement(["deposit", "withdraw", "transfer"])

    const accountId = faker.helpers.arrayElement(
        user.accounts.map(acc => `${acc.accountNumber}`)
    )

    const amount = parseFloat(faker.finance.amount(5, 5000, 2))

    const note = faker.lorem.sentence()

    const date = faker.date.past({ years: 5 })

    const transaction = {
        username,
        type,
        accountId,
        amount,
        note,
        date
    }

    if (type !== 'withdraw') {
        return transaction
    }

    const fromAccountId = faker.helpers.arrayElement(
        user.accounts.map(acc => `${acc.accountNumber}`).filter(id => id !== accountId)
    )

    return {
        ...transaction,
        fromAccountId,
        toAccountId: accountId,
    }
}

module.exports = {
    createFakeUser,
    createBankAccount,
    createTransaction,
}