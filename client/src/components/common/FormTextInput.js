import React from "react"

export default function FormTextInput(props) {
    return (
        <div className="form-group">
            <label for={props.formName} className="text-info">{props.displayName}:</label><br />
            <input 
                type={props.password ? "password" : "text"}
                ref={props.domRef}
                name={props.formName} 
                id={props.formName} 
                className="form-control" 
            />
        </div>
    )
}