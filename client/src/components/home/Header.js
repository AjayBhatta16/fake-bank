import React from 'react'
import env from '../../env'

export default function Header(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">{env.bankName}</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <form className="form-inline my-2 my-lg-0">
                    <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => {props.setScreen('login')}}>Login</button>
                    <button className="btn btn-outline-info my-2 my-sm-0" onClick={() => {props.setScreen('signup')}}>Sign Up</button>
                </form>
            </div>
        </nav>
    )
}