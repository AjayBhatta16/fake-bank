import React from 'react'
import HomeContainer from './HomeContainer'
import Header from './Header'
import SalesPitch from './SalesPitch'

export default function HomeScreen(props) {
    return (
        <HomeContainer>
            <Header setScreen={props.setScreen} />
            <SalesPitch setScreen={props.setScreen} />
        </HomeContainer>
    )
}