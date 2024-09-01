import React from 'react'

export default function AlternativeLink(props) {
    return (
        <div id="register-link" className="text-right">
            <a 
                href="#" 
                className="text-info" 
                onClick={() => {props.setScreen(props.destination)}}
            >{props.text}</a>
        </div>
    )
}