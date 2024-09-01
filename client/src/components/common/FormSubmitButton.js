import React from "react"

export default function FormSubmitButton(props) {
    return (
        <div className="form-group">
            <button
                name="submit" 
                className="btn btn-info btn-md" 
                onClick={props.onClick}
            >{props.displayText}</button>
        </div>
    )
}