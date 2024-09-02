import React from 'react'
import formatCurrency from '../../utils/format-currency'
import formatAccountNumber from '../../utils/format-account-number'
import AccountActionButton from './AccountActionButton'

export default function AccountRow(props) {
    const handleExchange = exchangeType => {
        props.setTarget(props.account)
        props.setScreen(exchangeType)
    }
    return (
        <tr>
            <td>
                {formatAccountNumber(props.account.accountNumber)}
            </td>
            <td>
                {props.account.accountType}
            </td>
            <td>
                {formatCurrency(props.account.amount)}
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('withdraw')}
                    displayText="Withdraw"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('deposit')}
                    displayText="Deposit"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => handleExchange('transfer')}
                    displayText="Transfer"
                />
            </td>
            <td>
                <AccountActionButton 
                    action={() => props.handleDelete(props.account)}
                    displayText="Delete"
                />
            </td>
        </tr>
    )
}