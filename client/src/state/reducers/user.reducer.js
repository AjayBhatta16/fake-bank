import * as UserActions from '../actions/user.actions'
import * as AccountActions from '../actions/account.actions'

const initialState = {
    userData: {},
    authToken: {},
    errorMessage: '',
}

export const user = (state = initialState, action) => {
    switch(action.type) {
        case UserActions.TypeConstants.LOGIN_SUCCESS:
        case UserActions.TypeConstants.SIGNUP_SUCCESS:
            return {
                ...state,
                userData: action.userData,
                authToken: action.authToken,
            }
        case UserActions.TypeConstants.LOGIN_ERROR:
        case UserActions.TypeConstants.SIGNUP_ERROR:
            return {
                ...state,
                errorMessage: action.errorMessage,
            }
        case AccountActions.TypeConstants.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: state.userData.accounts.filter(
                        acc => acc.accountNumber.toString() !== action.accountID?.toString(),
                    )
                }
            }
        case AccountActions.TypeConstants.CREATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    accounts: [
                        ...state.userData.accounts,
                        action.account,
                    ],
                }
            }
        case AccountActions.TypeConstants.EXCHANGE_SUCCESS:
            const newUserData = {...state.userData}

            console.log(action, newUserData)

            newUserData.accounts.forEach(acc => {
                if (acc.accountNumber.toString() === action.transaction.toAccount.toString()) {
                    console.log(`Adding $${action.transaction.amount} to account ${acc.accountNumber}`)
                    acc.amount += action.transaction.amount
                }

                if (acc.accountNumber.toString() === action.transaction.fromAccount.toString()) {
                    console.log(`Subtracting $${action.transaction.amount} from account ${acc.accountNumber}`)
                    acc.amount -= action.transaction.amount
                }
            })

            return {
                ...state,
                userData: newUserData,
            }
        default:
            return state
    }
}