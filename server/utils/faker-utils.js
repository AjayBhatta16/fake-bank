const faker = require("@faker-js/faker").faker

const createFakeUser = () => {
    return {
        username: faker.internet.userName(),
        fullName: faker.person.fullName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        accounts: [],
    }
}

const createBankAccount = (username) => {
    return {
        username,
        accountType: faker.helpers.arrayElement(["checking", "savings"]),
        amount: parseFloat(faker.finance.amount({
            min: 10,
            max: 100000,
            dec: 2,
        })),
        transactions: [],
    }
}

const createTransaction = (user) => {
    const username = user.username

    const type = faker.helpers.arrayElement(["deposit", "withdraw", "transfer"])

    const toAccount = type === "withdraw"
        ? "Bank Service"
        : faker.helpers.arrayElement(
            user.accounts.map(acc => acc.accountNumber)
        )

    const fromAccount = type === "deposit"
        ? "Bank Service"
        : faker.helpers.arrayElement(
            user.accounts.map(acc => acc.accountNumber).filter(id => id !== toAccount)
        )

    const amount = parseFloat(faker.finance.amount({
        min: 5,
        max: 5000,
        dec: 2,
    }))

    const note = faker.lorem.sentence()

    const timestamp = new Date(faker.date.past({ years: 5 })).getTime()

    return {
        username,
        type,
        toAccount,
        fromAccount,
        amount,
        note,
        timestamp
    }
}

module.exports = {
    createFakeUser,
    createBankAccount,
    createTransaction,
}