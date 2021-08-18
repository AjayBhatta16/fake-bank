import React from 'react'

export default function HomeContainer(props) {
    return (
        <div className="container-fluid standard-background">
            {props.children}
        </div>
    )
}