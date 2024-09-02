import env from '../../env'
import axios from 'axios'

export default async function deposit(tokenID, to, amount, note, activeUserData) {
    let exchangeRes
    await axios.post(`${env.endpoint}/exchange`, {
        username: activeUserData.username,
        tokenId: tokenID,
        to: parseInt(to),
        transactionType: 'deposit',
        amount: amount,
        note: note
    }).then(res => {
        exchangeRes = res.data 
    }).catch(err => {
        console.log(err)
        return {
            errMsg: "An unknown error has occurred"
        }
    })
    activeUserData.accounts.forEach(account => {
        if(account.accountNumber == parseInt(to)) {
            account.amount += amount
            if (!account.transactions) {
                account.transactions = []
            }
            account.transactions.push({
                amount: amount,
                fromAccount: "Bank Service",
                toAccount: to,
                timestamp: (new Date(Date.now())).getTime(),
                transactionType: "deposit",
                note: note
            })
        }
    })
    return { exchangeRes, newUserData: activeUserData}
}