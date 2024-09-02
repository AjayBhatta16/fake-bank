import env from '../../env'
import axios from 'axios'

export default async function internalTransfer(tokenID, from, to, amount, note, activeUserData) {
    let exchangeRes
    await axios.post(`${env.endpoint}/exchange`, {
        username: activeUserData.username,
        tokenId: tokenID,
        from: parseInt(from),
        to: parseInt(to),
        transactionType: 'transfer',
        amount: amount,
        note: note
    }).then(res => {
        exchangeRes = res.data 
    }).catch(err => {
        console.log(err)
        return {
            errMsg: 'An unknown error message has occurred.'
        }
    })
    activeUserData.accounts.forEach(account => {
        if(account.accountNumber == parseInt(from)) {
            account.amount -= amount
            if (!account.transactions) {
                account.transactions = []
            }
            account.transactions.push({
                amount: amount,
                fromAccount: from,
                toAccount: to,
                timestamp: (new Date(Date.now())).getTime(),
                transactionType: "transfer",
                note: note,
                hideFromTable: true
            })
        } 
        if(account.accountNumber == parseInt(to)) {
            account.amount += amount
            if (!account.transactions) {
                account.transactions = []
            }
            account.transactions.push({
                amount: amount,
                fromAccount: from,
                toAccount: to,
                timestamp: (new Date(Date.now())).getTime(),
                transactionType: "transfer",
                note: note,
            })
        }
    })
    return { exchangeRes, newUserData: activeUserData }
}