import React from 'react'

export default function Transaction(props) {
    const toCurrency = amount => '$' + amount.toFixed(2)
    const dateObj = new Date(props.transaction.timestamp)
    return (
        <tr>
            <td>{dateObj.toLocaleDateString()}</td>
            <td>{dateObj.toLocaleTimeString()}</td>
            <td>{props.transaction.fromAccount}</td>
            <td>{props.transaction.toAccount}</td>
            <td>{toCurrency(props.transaction.amount)}</td>
            <td>{props.transaction.note}</td>
        </tr>
    )
}