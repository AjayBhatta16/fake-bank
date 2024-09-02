import React from "react"
import MaybeDisplay from "../common/MaybeDisplay"

export default function AccountDropdown(props) {
    return (
        <div className="form-group">
            <label for={props.formName} className="text-info">{props.displayName}:</label>
            <select className="form-control" id="from" onChange={props.changeAction}>
                { props.accounts.map(acc => (
                    <option
                        value={acc.accountNumber.toString()}
                        key={acc.accountNumber}
                    >
                        {acc.accountNumber} ({acc.accountType})
                    </option>
                ))}
                <MaybeDisplay if={props.includeExternalOption}>
                    <option value="external">External</option>
                </MaybeDisplay>
            </select>
        </div>
    )
}