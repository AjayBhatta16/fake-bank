import { combineReducers } from 'redux'
import { user } from './user.reducer'
import { accounts } from './account.reducer'
import { general } from './general.reducer'

const reducer = combineReducers({
    user,
    accounts,
    general
})

export default reducer