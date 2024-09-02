import React from 'react'
import formatCurrency from '../../utils/format-currency'

export default function TransactionRow(props) {
    const dateObj = new Date(props.transaction.timestamp)
    return (
        <tr>
            <td>{dateObj.toLocaleDateString()}</td>
            <td>{dateObj.toLocaleTimeString()}</td>
            <td>{props.transaction.fromAccount}</td>
            <td>{props.transaction.toAccount}</td>
            <td>{formatCurrency(props.transaction.amount)}</td>
            <td>{props.transaction.note}</td>
        </tr>
    )
}