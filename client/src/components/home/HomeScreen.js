import React from 'react'
import HomeContainer from './HomeContainer'
import Header from './Header'
import SalesPitch from './SalesPitch'
import { useNavigate } from 'react-router-dom'

export default function HomeScreen() {
    const navigate = useNavigate()

    return (
        <HomeContainer>
            <Header setScreen={navigate} />
            <SalesPitch setScreen={navigate} />
        </HomeContainer>
    )
}