import env from '../../env'
import axios from 'axios'

export default async function externalTransfer(tokenID, from, amount, note, wireNumber, activeUserData) {
    let exchangeRes
    console.log("wire transfer")
    await axios.post(`${env.endpoint}/exchange`, {
        username: activeUserData.username,
        tokenId: tokenID,
        from: parseInt(from),
        transactionType: 'transfer',
        to: `Wire ${wireNumber}`,
        amount: amount,
        note: note,
        wireTransfer: true
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
            console.log("adding to UI logs")
            account.transactions.push({
                amount: amount,
                fromAccount: from,
                toAccount: `Wire ${wireNumber}`,
                timestamp: (new Date(Date.now())).getTime(),
                transactionType: "transfer",
                note: note,
            })
        }
    })
    return { exchangeRes, newUserData: activeUserData }
}