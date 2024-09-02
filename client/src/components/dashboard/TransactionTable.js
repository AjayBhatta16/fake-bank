import React from "react"
import TransactionRow from "./TransactionRow"

export default function TransactionTable(props) {
    return (
        <div className='table-responsive mt-3'>
            <table className='table table-striped table-hover table-dark'>
                <thead>
                    <tr>
                        <th colSpan="6">Transaction History</th>
                    </tr>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {props.transactions.length == 0 ? (
                        <tr>
                            <td colspan="6">No accounts found for this user</td>
                        </tr>
                    ) : null}
                    {
                        props.transactions.map(txn => (
                            <TransactionRow transaction={txn} key={txn.timestamp} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}