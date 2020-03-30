import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { isValidCron } from 'cron-validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faClock, faCheckCircle, faBan, faGlobeAmericas, faPercent, faBirthdayCake } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import {Formik, Field, useField} from 'formik';
import axios from 'axios';
import '../styles/config.css';
let cronParser = require('cron-parser');


const Config = (props) =>{
    const [configValues, setConfigValues] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [botEnabled, setBotEnabled] = useState(false);
    const [cronValue, setCronValue] = useState("");
    const [cronValid, setCronValid] = useState(false);
    const [nextCronDate, setNextCronDate] = useState("");
    const [nextCronDate2, setNextCronDate2] = useState("");
    const [buySize, setBuySize] = useState("");
    const [limitOrderDiff, setLimitOrderDiff] = useState("");
    const [configId, setConfigId] = useState("");
    const [minBuySize, setMinBuySize] = useState(Number(process.env.REACT_APP_MIN_BUY_SIZE));

    const divStyle = {
        fontSize: "14px",
        color: "white",
        textAlign: "left"
    }

    const feedbackStyle = {
        maxWidth: "250px",
        display: "block"
    }

    const fixedWidth = {
        maxWidth: "250px",
        width: "250px"
    }

    useEffect(() =>{
        let instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {}
          });
          instance.get('/getConfig').then((resp) => {
              console.log(resp.data.data);
              let config = resp.data.data;
              setBotEnabled(config.botEnabled);
              setCronValue(config.cronValue);
              setBuySize(config.buySize);
              setLimitOrderDiff(config.limitOrderDiff);
              setConfigId(config._id);
              setBuyDates(config.cronValue);
              setIsFetching(false);
          })
      },[])

    

    const handleBotEnabledChange = () => {
        console.log("click");
        setBotEnabled(!botEnabled);
    }

    const handleCronEntry = (ev) => {
        let value = ev.target.value.toLowerCase();
        
        setBuyDates(value);
        console.log(isValidCron(value))
        if(isValidCron(value)){
            setCronValid(true);
            setCronValue(value);
        }
        else{
            setCronValue(value);
            setCronValid(false);
        }
    }

    const setBuyDates = (value) => {
        let cronOptions = {
            currentDate: new Date(),
            tz: 'America/New_York'
        };
        let nextDate = cronParser.parseExpression(value , cronOptions).next();
        cronOptions = {
            currentDate: nextDate,
            tz: 'America/New_York'
        };
        let nextDate2 = cronParser.parseExpression(value, cronOptions).next();
        setNextCronDate(nextDate.toString())
        setNextCronDate2(nextDate2.toString());
    }

    const handleSizeEntry = (ev) => {
        setBuySize(ev.target.value)
    }

    const handleDifferentialEntry = (ev) => {
        setLimitOrderDiff(ev.target.value)
    }

    
    const saveChanges = (config) => new Promise(function(resolve, reject) {
            let instance = axios.create({
                baseURL: process.env.REACT_APP_API_URL,
                timeout: 10000,
                headers: {}
            });
            instance.post('/saveConfig', {params: config}).then((resp) => {
                //We need to get the response and fill the values
                setEditMode(false);
                resolve(resp.data.data);
            })
        })


    let configLayout = (
        <div className="center" >
            <div className="fontColor center" style={divStyle}>
            <br /><br />
            <Formik
                initialValues={{
                    id: configId,
                    botEnabled: botEnabled,
                    buySize:buySize,
                    limitOrderDiff: limitOrderDiff,
                    cronValue:cronValue
                }}
                enableReinitialize={true}
                validate={(values) => {
                    const errors = {};
                    var numbers = /^\d*(\.\d+)?$/;
                    //!values.buySize.match(numbers) || 
                    if (!values.buySize.toString().match(numbers) || values.buySize < minBuySize){
                        errors.buySize = "Numbers only. Must be greater than $"+minBuySize+"."
                    }
                    if (!values.limitOrderDiff.toString().match(numbers) || values.limitOrderDiff <= 0){
                        errors.limitOrderDiff = "Numbers only. Must be greater than 0%"
                    }
                    
                    if(!isValidCron(values.cronValue)){
                        errors.cronValue = "Invalid cron entry. Visit https://crontab.guru/ for help.";
                    }
                    return errors;
                }}
                validateOnChange={true}
                onSubmit={values => {
                    saveChanges(values).then((data)=>{
                        setBotEnabled(data.botEnabled);
                        setCronValue(data.cronValue);
                        setBuySize(data.buySize);
                        setLimitOrderDiff(data.limitOrderDiff);
                        setConfigId(data._id);
                        setBuyDates(data.cronValue);
                        setIsFetching(false);
                    });
                }} 
            >   
                {({ values, dirty, errors, setFieldValue, handleChange, isSubmitting, handleSubmit, isValid }) => (
                    
                    <div className="center" style={fixedWidth}> 
                    
                        <Button variant="primary" className="fiveSpace"  style={{display: editMode ? "none" : ""}}
                            type="submit" onClick={()=>setEditMode(!editMode)}> Edit </Button><br />
                        <span>Crypto Bot is <b>{values.botEnabled ? "ENABLED" : "DISABLED"}</b></span><br />
                        <Field 
                            onChange={(e)=>{
                                setFieldValue("botEnabled", !values.botEnabled);
                            }}
                            disabled={!editMode}
                            type="checkbox" checked={values.botEnabled} name="botEnabled" error={errors} as={Switch}
                        />
                        <br />
                        <br />
                        <div className="input-group mb-3 ">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faDollarSign} style=""/>  
                            </span>
                            </div>
                            <Field 
                                disabled={!editMode} 
                                type="number" isValid={false} 
                                isInvalid={!!errors.buySize} name="buySize" error={errors} onChange={handleChange} as={Form.Control}
                            />
                        </div>
                        <Form.Control.Feedback style={feedbackStyle} type="invalid">
                                {errors.buySize}<br />
                        </Form.Control.Feedback>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faPercent} style=""/>  
                            </span>
                            </div>
                            <Field 
                                disabled={!editMode}
                                type="number" step="0.1" isValid={false} 
                                isInvalid={!!errors.limitOrderDiff} name="limitOrderDiff" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            
                        </div>
                        <Form.Control.Feedback style={feedbackStyle} type="invalid">
                                {errors.limitOrderDiff} <br />
                            </Form.Control.Feedback>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faClock} style=""/>  
                            </span>
                            </div>
                            <Field 
                                disabled={!editMode}
                                type="input" isValid={!errors.cronValue} 
                                isInvalid={!!errors.cronValue} name="cronValue" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            
                        </div>
                            <Form.Control.Feedback style={feedbackStyle} type="invalid">
                                {errors.cronValue} <br />
                            </Form.Control.Feedback>
                        
                            <div className={dirty ? "unsaved" : ""} style={fixedWidth}>
                        <Button variant="primary" className="fiveSpace" style={{display: dirty ? "" : "none"}} disabled={isSubmitting} 
                            type="submit" onClick={handleSubmit}> Save Changes </Button>
                        <Button variant="light" className="fiveSpace" style={{display: editMode ? "" : "none"}}
                            type="submit" onClick={()=>{
                                setEditMode(!editMode);
                                setFieldValue("botEnabled",botEnabled);
                                setFieldValue("buySize",buySize);
                                setFieldValue("limitOrderDiff",limitOrderDiff);
                                setFieldValue("cronValue",cronValue);
                            }}> Cancel </Button></div>
                        
                        {/* <pre style={divStyle}>values: {JSON.stringify(values, null, 2)}</pre>
                        <pre style={divStyle}>errors: {JSON.stringify(errors, null, 2)}</pre> */}
                    </div>
                    
                )}
                
                
            </Formik>
                      
            <br />
            <br />
            Preview of next scheduled buys... 
            <br />1: {nextCronDate}
            <br />2: {nextCronDate2}
            </div>
        </div>
    )

    let spinner = (<div className="loader">Loading...</div>)

  return isFetching ? spinner : configLayout;

}

export default Config;
