import React from 'react'

export default function Account(props) {
    const toCurrency = amount => '$' + amount.toFixed(2)
    const handleExchange = exchangeType => {
        props.setTarget(props.account)
        props.setScreen(exchangeType)
    }
    return (
        <tr>
            <td>
                {
                    props.account.accountNumber.toString()
                                               .split('')
                                               .map((ch, i) => {
                                                   return i < 4 ? '*' : ch 
                                               })
                                               .join('')
                }
            </td>
            <td>
                {props.account.accountType}
            </td>
            <td>
                {toCurrency(props.account.amount)}
            </td>
            <td>
                <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => handleExchange('withdraw')}>Withdraw</button>
            </td>
            <td>
                <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => handleExchange('deposit')}>Deposit</button>
            </td>
            <td>
                <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => handleExchange('transfer')}>Transfer</button>
            </td>
            <td>
                <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => props.handleDelete(props.account)}>Delete</button>
            </td>
        </tr>
    )
}