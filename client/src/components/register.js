import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, FormControl } from "react-bootstrap";
import { api } from "../apis/apiCalls";
import Switch from "react-switch";
import "../styles/login.css";
import '../styles/spinner.css';

const Register = (props) =>{
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cbpKey, setCbpKey] = useState("");
    const [cbpSecret, setCbpSecret] = useState("");
    const [cbpPassphrase, setCbpPassphrase] = useState("");
    const [showSpinner, setShowSpinner] = useState(true);
    const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);

    useEffect(() =>{
        checkDatabaseForUsers();
    },[])

    const checkDatabaseForUsers = () => {
        api().get('/users/count').then((resp) => {
            //if no users exist, route to /register
                let num = resp.data.data;
                console.log("NUMBER OF USERS FOUND: ",resp.data)
            if(num === 0) {
                setShowSpinner(false);
            }
            else{
                //window.location.href="/";
                setShowSpinner(false);
            }
        }).catch(err => console.log("Unable to get user count.",err))
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(validated);
        if(validateForm()){
            console.log("SUBMITTED!!")
            let json = {email, password, enableEmailAlerts, cbpKey, cbpSecret, cbpPassphrase};
            console.log(json)
            api().post('/users', {email, password, enableEmailAlerts, cbpKey, cbpSecret, cbpPassphrase}).then((resp) => {   
                console.log(resp)
                if(resp.data.id) console.log("User created success!")
            }).catch(err=>console.log("Cannot send auth request.",err))
        }
    }

    function validateForm() {
        console.log("Running form check...")
        let valid = false;
        if(email.length > 0 &&
            password.length > 0 &&
            cbpKey.length > 0 && 
            cbpPassphrase.length > 0 && 
            cbpKey.length > 0
        ) {
            setValidated(true);
            return true;
        }
        else{
            setValidated(false);
            return false;
        }
    }

    let register = ( 
        <div className="Login">
            <Form validated={validated} onSubmit={handleSubmit}>
                <FormGroup controlId="userinfo">
                <Form.Label>Name</Form.Label>
                <FormControl
                    autoFocus
                    required
                    type="name"
                    value={name}
                    onChange={e => {
                        setName(e.target.value)
                        validateForm();
                    }}
                />
                
                <Form.Label>Email</Form.Label>
                <FormControl
                    type="email"
                    value={email}
                    required
                    onChange={e => {
                        setEmail(e.target.value)
                        validateForm();
                    }}
                />
                
                <Form.Label>Password</Form.Label>
                <FormControl
                    value={password}
                    required
                    onChange={e => {
                        setPassword(e.target.value);
                        validateForm();
                    }}
                    type="password"
                /><br /><br />
                <Form.Label>Enable Alert Emails</Form.Label><br />
                <Switch checked={enableEmailAlerts} onChange={(el, state) => this.handleSwitch(el, state)} name='test' />
                </FormGroup>
                <FormGroup controlId="cbp">
                <div><hr /></div>
                <div className="cbp">
                    <Form.Label>Coinbase Pro Key</Form.Label>
                    <FormControl
                        value={cbpKey}
                        required
                        onChange={e => {
                            setCbpKey(e.target.value);
                            validateForm();
                        }}
                        type="text"
                    />
                    <Form.Label>Coinbase Pro Secret</Form.Label>
                    <FormControl
                        value={cbpSecret}
                        required
                        onChange={e => {
                            setCbpSecret(e.target.value);
                            validateForm();
                        }}
                        type="text"
                    />
                    <Form.Label>Coinbase Pro Passphrase</Form.Label>
                    <FormControl
                        value={cbpPassphrase}
                        required
                        onChange={e => {
                            setCbpPassphrase(e.target.value);
                            validateForm();
                        }}
                        type="text"
                    />
                    <br /><a style={{color:"white"}} href="#">More info</a>
                </div>
                </FormGroup>
                <Button block disabled={false} type="submit">
                Register
                </Button>
            </Form>
        </div>
    );
    let spinner = (<div className="loader">Loading...</div>);
    
    return (<> {showSpinner ? spinner : register} </>);
}

export default withRouter(Register);
