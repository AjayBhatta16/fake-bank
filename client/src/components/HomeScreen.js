import React from 'react'
import HomeContainer from './home/HomeContainer'
import Header from './home/Header'
import SalesPitch from './home/SalesPitch'

export default function HomeScreen() {
    return (
        <HomeContainer>
            <Header />
            <SalesPitch />
        </HomeContainer>
    )
}