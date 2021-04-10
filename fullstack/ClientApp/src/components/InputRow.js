import React  from 'react'
import './InputRow.css'
export function InputRow(props) {
    return (
        <tr className="input-row">
            <td><span>{props.value.userID}</span></td>
            <td> <input value={props.value.regDate} type="date" min="2010-01-01" max="2022-01-01" onChange={props.onRegChange} required /></td>
            <td><input value={props.value.lastActiveDate} type="date" min="2010-01-01" max="2022-01-01" onChange={props.onLastActiveChange} required /></td>
        </tr>
    )
}
