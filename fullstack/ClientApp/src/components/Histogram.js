import React, { useEffect,useState } from 'react'
import './Histogram.css'




export function Histogram(props){
    const formatted = props.data.sort((a, b) => {
        return a.value-b.value
    }).map((item, index) => {
        const height = `${100 * item.times / props.data.reduce((max, elem)=>elem.times>max?elem.times:max,1)}%`
        return (
            <div key={index} className="histogram-item" style={{ height: height }}>
                <span className="histogram-text">{item.value}</span>
            </div>
        )
    })
    const numBerofItems = props.data.reduce((sum,elem)=>sum+elem.times,0)
    const yAxisMax = props.data.reduce((max, elem) => elem.times > max ? elem.times : max, 0)
    const yAxisArray = [...Array(6)].map((a, i) => (i * yAxisMax / numBerofItems) * 20).map(item => {
        return <div>{isNaN(item) ? "" : `${Math.round(item)}%`}</div>
    }).reverse()
    return (
        <div className="histogram">
            <div className='Y-axis'>{yAxisArray}</div>
            <div className="histogram-bars">
                {formatted}
            </div>
            <div className='X-axis'>Days since registration</div>
        </div>
    )

}

