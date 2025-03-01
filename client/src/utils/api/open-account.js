import env from '../../env'
import axios from 'axios'

const openAccount = async (username, tokenID, type, amount) => {
    let accountCreated

    await axios.post(`${env.endpoint}/account/create`, {
        username: username,
        tokenId: tokenID,
        type: type,
        amount: amount 
    }).then(res => {
        accountCreated = res.data
    }).catch(err => {
        console.log(err)
        return {
            errMsg: "An unknown error has occurred"
        }
    })

    console.log('openAccount', accountCreated)

    if(!accountCreated.accountNumber) {
        return {
            errMsg: 'Your login session has expired. Please refresh the page.'
        }
    }

    return accountCreated
}

export default openAccount