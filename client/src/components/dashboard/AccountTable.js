import React from "react"
import AccountRow from "./AccountRow"

export default function AccountTable(props) {
    const handleAdd = () => {
        props.setScreen('add')
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
                    {props.dashboardUser.accounts.length == 0 ? (
                        <tr>
                            <td colspan="7">No accounts found for this user</td>
                        </tr>
                    ) : null}
                    {
                        props.dashboardUser.accounts.map(account => (
                            <AccountRow 
                                account={account} 
                                key={account.accountNumber}
                                setScreen={props.setScreen} 
                                setTarget={props.setTarget}
                                handleDelete={props.handleDelete}
                            />    
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}