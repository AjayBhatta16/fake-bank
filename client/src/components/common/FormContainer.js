import React from 'react'
import stopRedirect from '../../utils/stop-redirect'

export default function FormContainer(props) {
    return (
        <div className="wrapper bg-dark signup">
            <div id="formContent">
                <h1 className="text-white text-center">{props.headerText}</h1>
                <form className="form" onSubmit={stopRedirect}>
                    { props.children }
                </form>
            </div>
        </div>
    )
}