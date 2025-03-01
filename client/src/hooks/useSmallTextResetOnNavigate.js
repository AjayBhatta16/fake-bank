import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import * as AccountActions from "../state/actions/account.actions"

export function useSmallTextResetOnNavigate() {
    const dispatch = useDispatch()
    const location = useLocation()

    useEffect(() => {
        dispatch(AccountActions.resetSmallText())
    }, [location])
}