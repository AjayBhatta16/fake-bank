import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useRefresh() {
    const userData = useSelector(state => state.user.userData)
    const navigate = useNavigate()
    useEffect(() => {
        if (!userData.username) {
            console.log('refresh detected')
            navigate('/login')
        }
    })
}