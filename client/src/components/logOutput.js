
import React from 'react';
import '../styles/App.css';

const logOutput = (props) => {

    const divStyle = {
        fontSize: "14px",
        color: "white",
        textAlign: "left"
    }

    let logRows = (<></>)
    if(props.logs && props.logs.length>0){ 
        logRows = props.logs.map((log,idx) => {
            return (
            <tr key={log._id}>
                <td>
                    {log.createdAt}
                </td>
                <td>
                    {log.logLevel}
                </td>
                <td>
                    {log.message}
                </td>
            </tr>
        )})
    }

    return (
        <table className="centerFlex " style={divStyle}>
            <tbody>
                <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Message</th>
                </tr>
                {logRows}
            </tbody>
        </table>
    )
}

export default logOutput;