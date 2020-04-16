import React from 'react';
import '../styles/App.css';
import '../styles/tile.css';
import Auxx from '../hoc/auxx';

const dateTile = (props) => {
    let rows = props.buyDates.map((date,idx) => {
        return (
            <div  key={idx+1}>{idx}. {date}</div>
        )
    })
    return (
        <div>
            {rows}
        </div>
    )
}

export default dateTile;