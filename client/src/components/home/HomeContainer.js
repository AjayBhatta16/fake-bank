import React from 'react'

export default function HomeContainer(props) {
    return (
        <div className="container-fluid home-background">
            {props.children}
        </div>
    )
}