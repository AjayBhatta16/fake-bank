import React from 'react'
import HomeContainer from './home/HomeContainer'
import Header from './home/Header'
import SalesPitch from './home/SalesPitch'

export default function HomeScreen(props) {
    return (
        <HomeContainer>
            <Header setScreen={props.setScreen} />
            <SalesPitch setScreen={props.setScreen} />
        </HomeContainer>
    )
}