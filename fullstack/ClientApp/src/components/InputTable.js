import React, { useEffect, useRef } from 'react'
import { InputRow } from './InputRow'
import './InputTable.css'
export function InputTable(props) {
    const formRef = useRef(null)
    useEffect(() => {
        //const myForm = document.getElementsByClassName("form")[0]
        //myForm.scrollTop = myForm.scrollHeight
        //formRef.current.scrollIntoView({behavior: 'smooth'})
    })

    const rows = props.data.map((elem, i) => {
        return <InputRow key={i} value={elem} onRegChange={(e) => { props.onRegChange(e, i) }} onLastActiveChange={(e) => { props.onLastActiveChange(e, i) }} />
    })
    return (
        <form ref={formRef} className="form" onSubmit={props.submitData}>
            <div className="table-container">
                <table className="input-table">
                    <thead>
                        <tr>
                            <th>UserID</th>
                            <th>Date Registration</th>
                            <th>Date Last Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
            <button className="button-add" onClick={props.addInput}>+</button>
            <div className="button-div">
                <button className="button" type="submit">Save</button>
            </div>
        </form>
    )
}
