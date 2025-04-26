import React from "react"
import { useSelector } from "react-redux"

export default function FormSubmitButton(props) {
    var loading = useSelector((state) => state.general.loading)

    return (
        <div className="form-group">
            <button
                name="submit" 
                className="btn btn-info btn-md" 
                onClick={props.onClick}
                disabled={loading}
            >{props.displayText}</button>
        </div>
    )
}