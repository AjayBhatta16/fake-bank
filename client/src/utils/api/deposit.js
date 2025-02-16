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

    return { 
        exchangeRes, 
        transaction: {
            amount: amount,
            fromAccount: "Bank Service",
            toAccount: to,
            timestamp: (new Date(Date.now())).getTime(),
            transactionType: "deposit",
            note: note
        }
    }
}