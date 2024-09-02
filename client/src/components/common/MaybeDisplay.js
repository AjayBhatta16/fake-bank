import React from "react"

export default function MaybeDisplay(props) {
    return (
        <>
            { props.if ? props.children : null }
        </>
    )
}