import React from "react"

export default function AccountActionButton(props) {
    return (
        <button 
            className="btn btn-outline-info my-2 my-sm-0" 
            onClick={props.action}
        >
            {props.displayText}
        </button>
    )
}