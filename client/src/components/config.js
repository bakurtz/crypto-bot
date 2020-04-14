import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { isValidCron } from 'cron-validator';
import '../styles/config.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faPencilAlt, faClock, faCheck, faPercent, faExclamation,faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Formik, Field } from 'formik';
import axios from 'axios';
import { api } from "../apis/apiCalls";
let cronParser = require('cron-parser');


const Config = (props) =>{
    const [editMode, setEditMode] = useState(false);
    const [saveErrorMsg, setSaveErrorMsg] = useState("");
    const [saveError, setSaveError] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [botEnabled, setBotEnabled] = useState(false);
    const [buyType, setBuyType] = useState("limit");
    const [cronValue, setCronValue] = useState("1 1 1 1 1");
    const [nextCronDate, setNextCronDate] = useState("");
    const [nextCronDate2, setNextCronDate2] = useState("");
    const [buySize, setBuySize] = useState(10);
    const [limitOrderDiff, setLimitOrderDiff] = useState(1);
    const [configId, setConfigId] = useState("");

    let minBuySize = process.env.REACT_APP_MIN_BUY_SIZE;

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
          api().get('/profile/getConfig').then((resp) => {
              console.log(resp.data.data);
              if(!!resp.data.data){ // In case no data exists in DB
                let config = resp.data.data;
                setBotEnabled(config.botEnabled);
                setCronValue(config.cronValue);
                setBuySize(config.buySize);
                setBuyType(config.buyType);
                setLimitOrderDiff(config.limitOrderDiff);
                setConfigId(config._id);
                setBuyDates(config.cronValue);
              }
              setIsFetching(false);
          })
      },[])

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

    const saveChanges = (config) => new Promise(function(resolve, reject) {
        api().post('/profile/saveConfig', {params: config}).then((resp) => {
            //We need to get the response and fill the values
            console.log(resp);
            if(resp.data.success===false){
                setSaveErrorMsg(resp.data.error);
                setSaveError(true);
            }
            else{
                setEditMode(false);
                setSaveErrorMsg("");
                setSaveError(false);
                setSaveSuccess(false);
            }
            setSaveErrorMsg("Save successful!");
            setSaveSuccess(true);
            resolve(resp.data.data);
        })
    })

    let unsavedChanges = (
        <span style={{color: "rgb(253, 203, 37)"}}>
            <FontAwesomeIcon className={"nowrap fas "} icon={faExclamation} style=""/>  
            <span>  You have unsaved changes.</span>
        </span>
    )

    let saveErrorFeedback = (
        <span style={{color: "red"}}> 
            <FontAwesomeIcon className={"nowrap fas "} icon={faExclamationTriangle} style=""/> 
            {saveErrorMsg ? saveErrorMsg : ""}
        </span>
    )

    let saveSuccessFeedback = (
        <span style={{color: "green"}}> 
            <FontAwesomeIcon className={"nowrap fas "} icon={faCheck} style=""/> 
            {saveSuccess ? saveErrorMsg : ""}
        </span>
    )

    
                        


    let configLayout = (
        <div className="centerFlex" >
            <div className="fontColor center" style={divStyle}>
            <Formik
                initialValues={{
                    id: configId,
                    botEnabled: botEnabled,
                    buyType: buyType ? buyType : "limit",
                    buySize: buySize ? buySize : "",
                    limitOrderDiff: limitOrderDiff ? limitOrderDiff : "",
                    cronValue:cronValue ? cronValue : "1 1 1 1 1"
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
                validateOnBlur={true}
            >   
                {({ values, dirty, errors, setFieldValue, handleChange, setSubmitting, isSubmitting, handleSubmit, isValid }) => (
                    
                    <div className="center" style={fixedWidth}> 
                        <br />
                        <br />
                        <span>Crypto Bot is <b>{values.botEnabled ? "ENABLED" : "DISABLED"}</b></span><br />
                        <Field 
                            onChange={(e)=>{
                                setFieldValue("botEnabled", !values.botEnabled);
                            }}
                            disabled={!editMode}
                            type="checkbox" checked={values.botEnabled} name="botEnabled" error={errors} as={Switch}
                        /><br />
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
                                <FontAwesomeIcon className={"nowrap fas danger"} icon={faClock} style=""/>  
                            </span>
                            </div>
                            <Field 
                                disabled={!editMode}
                                type="input"
                                isInvalid={!!errors.cronValue} name="cronValue" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            
                        </div>
                            <Form.Control.Feedback style={feedbackStyle} type="invalid">
                                {errors.cronValue} <br />
                            </Form.Control.Feedback>
                        
                            <div className="input-group mb-3">
                            <Form.Check inline
                                disabled={!editMode} 
                                name="buyType"
                                type="radio"
                                value="limit"
                                label="Limit"
                                checked={values.buyType==="limit"}
                                onChange={handleChange}
                            />
                            <Form.Check inline
                                disabled={!editMode} 
                                name="buyType"
                                type="radio"
                                value="market"
                                label="Market"
                                checked={values.buyType==="market"}
                                onChange={handleChange}
                            />
                        </div>
                        

                        <div className="input-group mb-3" style={{display: values.buyType==="market" ? "none" : ""}}>
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

                        <div className="" style={fixedWidth}>
                        
                        { saveError ? saveErrorFeedback : ""}
                        { dirty && !saveError ? unsavedChanges : ""}
                        { saveSuccess ? saveSuccessFeedback : ""}
                        <br />
                        <Button variant="primary" className="fiveSpace"  style={{display: editMode ? "none" : ""}}
                            onClick={()=>{
                                setEditMode(!editMode);
                                setSaveSuccess(false);
                            }}> 
                            <FontAwesomeIcon className="far" icon={ faPencilAlt } />
                            <span>      Edit</span> 
                        </Button>
                        
                        <Button variant="primary" className="fiveSpace" style={{display: dirty ? "" : "none"}} disabled={isSubmitting} 
                            type="submit" onClick={()=>{
                                if(Object.keys(errors).length===0){
                                saveChanges(values).then((data)=>{
                                    if(data){
                                        setBotEnabled(data.botEnabled);
                                        setBuyType(data.buyType)
                                        setCronValue(data.cronValue);
                                        setBuySize(data.buySize);
                                        setLimitOrderDiff(data.limitOrderDiff);
                                        setConfigId(data._id);
                                        setBuyDates(data.cronValue);
                                        setIsFetching(false);
                                    }
                                    setSubmitting(false);
                                });
                                }
                            }}> Save Changes </Button>
                        <Button variant="light" className="fiveSpace" style={{display: editMode ? "" : "none"}}
                            onClick={()=>{
                                setEditMode(!editMode);
                                setFieldValue("botEnabled",botEnabled);
                                setFieldValue("buySize",buySize);
                                setFieldValue("limitOrderDiff",limitOrderDiff);
                                setFieldValue("cronValue",cronValue);
                                setSaveError(false);
                                setSaveErrorMsg("");
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
