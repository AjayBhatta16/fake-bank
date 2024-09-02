import axios from 'axios' 
import env from '../../env'

const deleteAccount = async (username, tokenID, accNumber) => {
    let response
    await axios.post(`${env.endpoint}/account/delete`, {
        username: username,
        tokenId: tokenID,
        accountNumber: accNumber
    }).then(res => {
        if(res.data.accountDeleted) {
            console.log("success")
            response = {
                success: true,
                msg: 'Account Deleted Successfully'
            }
        } else {
            console.log("fail")
            response = {
                success: false,
                msg: 'An unknown error has occurred'
            }
        }
    }).catch(error => {
        console.log(error)
        response = {
            success: false,
            msg: 'An unknown error has occurred'
        }
    })
    console.log(response)
    return response
}
export default deleteAccount