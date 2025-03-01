import { combineReducers } from 'redux'
import { user } from './user.reducer'
import { accounts } from './account.reducer'

const reducer = combineReducers({
    user,
    accounts,
})

export default reducer