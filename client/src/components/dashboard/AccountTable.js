import React from "react"
import AccountRow from "./AccountRow"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AccountTable() {
    const navigate = useNavigate()
    const accounts = useSelector(state => state.user.userData.accounts)

    const handleAdd = () => {
        navigate('/accounts/add')
    }

    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover table-dark">
                <thead>
                    <tr>
                        <th colspan="5">Your accounts</th>
                        <th colSpan="2">
                            <div className='float-right'>
                                <button 
                                    className="btn btn-primary btn-sm my-0" 
                                    onClick={handleAdd}
                                >+ New Account</button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!accounts || accounts.length == 0 ? (
                        <tr>
                            <td colspan="7">No accounts found for this user</td>
                        </tr>
                    ) : null}
                    {
                        accounts?.map(account => (
                            <AccountRow 
                                account={account} 
                                key={account.accountNumber}
                            />    
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}