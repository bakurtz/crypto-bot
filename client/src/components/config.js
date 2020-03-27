import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { isValidCron } from 'cron-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';
let cronParser = require('cron-parser');


const Config = (props) =>{
    const [botEnabled, setBotEnabled] = useState(false);
    const [cronValue, setCronValue] = useState(false);
    const [cronValid, setCronValid] = useState(false);
    const [nextCronDate, setNextCronDate] = useState("");
    const [nextCronDate2, setNextCronDate2] = useState("");

    var divStyle = {
        padding: "30px",
        width:"80%"
    };

    const handleBotEnabledChange = () => {
        console.log("click");
        setBotEnabled(!botEnabled);
    }

    const handleCronEntry = (ev) => {
        let value = ev.target.value.toLowerCase();
        let cronOptions = {
            currentDate: new Date(),
            tz: 'America/New_York'
        };
        let parser = 
        console.log(isValidCron(value))
        if(isValidCron(value)){
            setCronValid(true);
            let nextDate = cronParser.parseExpression(value , cronOptions).next();
            cronOptions = {
                currentDate: nextDate,
                tz: 'America/New_York'
            };
            let nextDate2 = cronParser.parseExpression(value, cronOptions).next();
            setNextCronDate(nextDate.toString())
            setNextCronDate2(nextDate2.toString())
        }
        else{
            setCronValid(false);
        }
    }

    let config = (
        <div className="center">
            <div className="fontColor about" style={divStyle}>
            <span>Crypto Bot Enabled</span><br />
            <Switch onChange={()=>handleBotEnabledChange()} checked={botEnabled} />
            <br />
            <br />
            <span>Recurring Buy Schedule</span><br />
            <select id="timeframe">
                <option value="bi-weekly">Custom</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <br />
            <br />
            <span>Crontab</span><br />
            <input size="5" onChange={handleCronEntry}></input>  
                {cronValid ?
                    <FontAwesomeIcon className="" color="green" icon={faCheckCircle} /> :
                    <FontAwesomeIcon className="" color="red" icon={faBan} /> 
                }
            <br />
            <br />
            Next scheduled buys... 
            <br />1: {nextCronDate}
            <br />2: {nextCronDate2}
            </div>
        </div>
    )

  return config;

}

export default Config;
