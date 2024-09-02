import React from "react"

export default function(props) {
    return (
        <small id="wrongPassword" className="text-success form-text">
            {props.text}
        </small>
    )
}