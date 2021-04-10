import React, { useEffect, useState } from 'react'
import { Histogram } from './Histogram'
import './Graphics.css'

export function Graphics(props) {
    const [rrd7, setrrd7] = useState(0)
    useEffect(() => {
        if (rrd7 < props.rrd7 - 1) {
            setTimeout(() => {
                setrrd7((rrd) => rrd + 1)
            }, props.rrd7 > 0 ? 800 / props.rrd7 : 50)
        } else if (props.rrd7 === 0) {
            setrrd7(rrd7=>0)
        }
    })
    return (
        <div className={`Graphics ${props.showGraphics ? 'Graphics-show' : ''}`}>
            {props.data.length==0?<div>No Data!</div>:           
                <div className="Graphics-data">
                    <p>
                        Rolling Retention 7 Day: <span className="rrd7"> {rrd7}%</span>
                    </p>
                    <Histogram data={props.data} />
                </div>}
        </div>
    )
}