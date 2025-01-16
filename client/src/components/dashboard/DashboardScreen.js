import React, {useState} from 'react'
import StandardContainer from '../StandardContainer'
import FormSuccessText from '../common/FormSuccessText'
import FormErrorText from '../common/FormErrorText'
import TransactionTable from './TransactionTable'
import AccountTable from './AccountTable'
import parseName from '../../utils/parse-name'
import parseTransactionList from '../../utils/parse-transaction-list'
import deleteAccount from '../../utils/api/delete-account'
import { useNavigate } from 'react-router-dom'

export default function DashboardScreen(props) {
    const [errMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [dashboardUser, setDashboardUser] = useState(props.user)
    const navigate = useNavigate()
    if (!props.user.username) {
        navigate('/')
    }
    const handleDelete = async account => {
        const deleteResult = await deleteAccount(props.user.username, props.token.id, account.accountNumber)
        if (deleteResult.success) {
            setSuccessMsg(deleteResult.msg)
            props.user.accounts = props.user.accounts.filter(bankAccount => bankAccount.accountNumber != account.accountNumber)
            props.setUser(props.user)
            setDashboardUser({...props.user})
        } else {
            setErrMsg(deleteResult.msg)
        }
    }
    const [firstName, lastName] = parseName(props.user.fullName)
    const transactions = parseTransactionList(props.user.accounts)
    return (
        <StandardContainer>
            <div className="custom-wide bg-dark">
                <h1 className="text-center text-white">{lastName}, {firstName}</h1>
                <AccountTable 
                    setScreen={navigate}
                    setTarget={props.setTarget}
                    dashboardUser={dashboardUser}
                    handleDelete={handleDelete}
                />
                <FormErrorText text={errMsg} />
                <FormSuccessText text={successMsg} />
                <TransactionTable transactions={transactions} />
            </div>
        </StandardContainer>
    )
}