import React from 'react'
import env from '../../env'

export default function SalesPitch(props) {
    return (
        <div className="jumbotron text-white bg-dark">
            <h1 className="display-4">{env.bankSlogan}</h1>
            <hr />
            <p className="lead">If money doesn't grow on trees, then why do banks have branches?</p>
            <p className="lead">
                <button className="btn btn-primary btn-lg" onClick={() => {props.setScreen('/signup')}}>Start Banking</button>
            </p>
        </div>
    )
}