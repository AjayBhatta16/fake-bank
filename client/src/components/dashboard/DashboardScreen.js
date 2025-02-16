import React from 'react'
import StandardContainer from '../StandardContainer'
import FormSuccessText from '../common/FormSuccessText'
import FormErrorText from '../common/FormErrorText'
import TransactionTable from './TransactionTable'
import AccountTable from './AccountTable'
import parseName from '../../utils/parse-name'
import { useSelector } from 'react-redux'
import { useRefresh } from '../../hooks/useRefresh'

export default function DashboardScreen() {
    useRefresh()
    
    const errorMessage = useSelector(state => state.accounts.errorMessage)
    const successMessage = useSelector(state => state.accounts.successMessage)
    const fullName = useSelector(state => parseName(state.user.userData.fullName))

    return (
        <StandardContainer>
            <div className="custom-wide bg-dark">
                <h1 className="text-center text-white">{fullName[1]}, {fullName[0]}</h1>
                <AccountTable />
                <FormErrorText text={errorMessage} />
                <FormSuccessText text={successMessage} />
                <TransactionTable />
            </div>
        </StandardContainer>
    )
}