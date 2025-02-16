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
    
    return { 
        exchangeRes, 
        transaction: {
            amount: amount,
            fromAccount: from,
            toAccount: to,
            timestamp: (new Date(Date.now())).getTime(),
            transactionType: "transfer",
            note: note,
        }
    }
}