import * as GeneralActions from '../actions/general.actions'

const initialState = {
    loading: false
}

export const general = (state = initialState, action) => {
    switch(action.type) {
        case GeneralActions.TypeConstants.REQUEST_START:
            return {
                ...state,
                loading: true
            }
        case GeneralActions.TypeConstants.REQUEST_END:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}