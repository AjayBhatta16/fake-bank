import env from '../../env'
import axios from 'axios'

export default async function withdraw(tokenID, from, amount, note, activeUserData) {
    let exchangeRes
    await axios.post(`${env.endpoint}/exchange`, {
        username: activeUserData.username,
        tokenId: tokenID,
        from: parseInt(from),
        transactionType: 'withdraw',
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
                toAccount: "Bank Service",
                timestamp: (new Date(Date.now())).getTime(),
                transactionType: "withdraw",
                note: note,
            })
        }
    })
    return { exchangeRes, newUserData: activeUserData }
}