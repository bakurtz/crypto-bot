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
    const [botEnabled, setBotEnabled] = useState(false);
    const [cronValue, setCronValue] = useState("");
    const [cronValid, setCronValid] = useState(false);
    const [nextCronDate, setNextCronDate] = useState("");
    const [nextCronDate2, setNextCronDate2] = useState("");
    const [buySize, setBuySize] = useState("");
    const [limitOrderDiff, setLimitOrderDiff] = useState("");
    const [configId, setConfigId] = useState("")

    const divStyle = {
        fontSize: "14px",
        color: "white",
        textAlign: "left"
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

    
    const saveChanges = () => {
        let config = {
            id: configId,
            botEnabled,
            buySize,
            limitOrderDiff,
            cronValue
        }

        let instance = axios.create({
            baseURL: process.env.REACT_APP_API_URL,
            timeout: 10000,
            headers: {}
          });
          instance.post('/saveConfig', {params: config}).then((resp) => {
              console.log(resp);
          })
    }


    let MyTextField1 = ({...props}) => {
        const [field, meta] = useField(props);
        const errorText = meta.error && meta.touched ? meta.error : "";
        console.log(field)
        return (
                <Form.Control
                    required
                    {...field}
                    isValid={false}
                    className="form-control hasError has-error" placeholder="Buy Size (USD $)" 
                    aria-label="Buy Size" aria-describedby="basic-addon1" 
                    size="5"/>
        )
    }

    

    let config = (
        <div className="center">
            <div className="fontColor center" style={divStyle}>
            <br />
            <Switch onChange={()=>handleBotEnabledChange()} checked={botEnabled} /><span>Crypto Bot is <b>Enabled</b></span>
            <br />
            <Formik
                initialValues={{
                    buySize:"a",
                    limitOrderDiff: "0.0005",
                    cronValue:"* * * * *"
                }}
                validate={(values) => {
                    const errors = {};
                    if (values.buySize.length>2){
                        errors.buySize = "Frick"
                    }
                    if (values.buySize2.length>2){
                        errors.buySize2 = "Frick, b2 is bad"
                    }

                    return errors;
                }}
                validateOnChange={true}
            >   
                {({ values, errors, handleChange, handleBlur, isValid }) => (
                    <form onSubmit={(event)=>{event.preventDefault()}} >
                        <pre style={divStyle}>values: {JSON.stringify(values, null, 2)}</pre>
                        <pre style={divStyle}>errors: {JSON.stringify(errors, null, 2)}</pre>
                        
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faDollarSign} style=""/>  
                            </span>
                            </div>
                            <Field 
                                type="input" isValid={false} isInvalid={!!errors.buySize} name="buySize" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.buySize}
                            </Form.Control.Feedback>    
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faPercent} style=""/>  
                            </span>
                            </div>
                            <Field 
                                type="input" isValid={false} isInvalid={!!errors.limitOrderDiff} name="limitOrderDiff" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.buySize}
                            </Form.Control.Feedback>
                        </div>

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                <FontAwesomeIcon className={"nowrap fas "} icon={faClock} style=""/>  
                            </span>
                            </div>
                            <Field 
                                type="input" isValid={isValidCron(values.cronValue)} isInvalid={!isValidCron(values.cronValue)} name="cronValue" error={errors} onChange={handleChange} as={Form.Control}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.buySize}
                            </Form.Control.Feedback>
                            
                        </div>
                    </form>
                )}
                
                
            </Formik>
            <form className="">
                <input type="submit" value="Save" className="btn btn-primary col-sm-offset-3" />
                <input type="button" value="Reset" className="btn btn-primary col-sm-offset-3" />
                    <div className="invalid hasError">
                        
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                              <FontAwesomeIcon className={"nowrap fas "} icon={faDollarSign} style=""/>  
                            </span>
                          </div>
                          <Form.Control
                            required
                            type="text" className="form-control has-error" name="name" placeholder="Buy Size (USD $)" aria-label="Full Name" aria-describedby="basic-addon1" 
                            size="5" onChange={handleSizeEntry} />
                      </div>
                      
                      <div className="form-group has-error">
                        <div className="input-group mb-3 has-error">
                          <div className="input-group-prepend has-error">
                            <span className="input-group-text has-error" id="basic-addon1">
                              <FontAwesomeIcon className={"nowrap far "} icon={faPercent} style=""/>  
                            </span>
                          </div>
                          <input type="text" className="form-control has-error" required name="Limit-to-Market Differential" placeholder="Limit-to-Market Differential" aria-describedby="basic-addon1"  
                          value={limitOrderDiff} onChange={handleDifferentialEntry}/>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                              <FontAwesomeIcon className={"nowrap fas "} icon={faClock} style=""/>  
                            </span>
                          </div>
                          <input 
                            type="text" className="form-control" name="crontab" placeholder="Cron timer" aria-label="Cron timer" aria-describedby="basic-addon1" 
                            value={cronValue} onChange={handleCronEntry} />
                      </div>
                      </div>
                      
                      
                    </div>
                </form>
               
            <br />{cronValid ?
                    <span> <FontAwesomeIcon className="" color="green" icon={faCheckCircle} /> <a href="#">reset</a> </span> :
                    <span> <FontAwesomeIcon className="" color="red" icon={faBan} /> <a href="#">reset</a> </span>
                }
            <br />
            <Button variant="success" onClick={saveChanges}>SAVE CHANGES</Button>
            <br />
            <br />
            Preview of next scheduled buys... 
            <br />1: {nextCronDate}
            <br />2: {nextCronDate2}
            </div>
        </div>
    )

  return config;

}

export default Config;
