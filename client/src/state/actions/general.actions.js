export const TypeConstants = {
    REQUEST_START: 'REQUEST_START',
    REQUEST_END: 'REQUEST_END'
}

export const requestStart = () => ({
    type: TypeConstants.REQUEST_START
})

export const requestEnd = () => ({
    type: TypeConstants.REQUEST_END
})