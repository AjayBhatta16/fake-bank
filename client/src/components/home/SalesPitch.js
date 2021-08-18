import React from 'react'

export default function SalesPitch(props) {
    return (
        <div className="jumbotron text-white bg-dark">
            <h1 className="display-4">Trust In Hugh Janus</h1>
            <hr />
            <p className="lead">If money doesn't grow on trees, then why do banks have branches?</p>
            <p class="lead">
                <a class="btn btn-primary btn-lg" href="#" onClick={() => {props.setScreen('signup')}}>Learn more</a>
            </p>
        </div>
    )
}