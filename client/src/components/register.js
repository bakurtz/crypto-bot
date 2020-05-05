import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Form, FormGroup, FormControl } from "react-bootstrap";
import { api } from "../apis/apiCalls";
import "../styles/login.css";
import '../styles/spinner.css';

const Register = (props) =>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cbpKey, setCbpKey] = useState("");
    const [cbpSecret, setCbpSecret] = useState("");
    const [cbpPassphrase, setCbpPassphrase] = useState("");
    const [isValid, setIsValid] = useState("");
    const [showSpinner, setShowSpinner] = useState(true);

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
                window.location.href="/";
            }
        }).catch(err => console.log("Unable to get user count.",err))
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        api().post('/users', {email, password, cbpKey, cbpSecret, cbpPassphrase}).then((resp) => {   
            console.log(resp)
            if(resp.data.id) console.log("User created success!")
        }).catch(err=>console.log("Cannot send auth request.",err))
    }

    function validateForm() {
        setIsValid(email.length > 0 && password.length > 0);
    }

    let register = ( 
        <div className="Login">
            <form onSubmit={handleSubmit}>
            <FormGroup controlId="name">
            <Form.Label>Name</Form.Label>
            <FormControl
                autoFocus
                type="name"
                value={name}
                onChange={e => {
                    setName(e.target.value)
                    validateForm();
                }}
            />
            </FormGroup>
            <FormGroup controlId="email">
            <Form.Label>Email</Form.Label>
            <FormControl
                type="email"
                value={email}
                onChange={e => {
                    setEmail(e.target.value)
                    validateForm();
                }}
            />
            </FormGroup>
            <FormGroup controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl
                value={password}
                onChange={e => {
                setPassword(e.target.value);
                validateForm();
                }}
                type="password"
            />
            <div><hr /></div>
            <div className="cbp">
                <Form.Label>Coinbase Pro Key</Form.Label>
                <FormControl
                    value={cbpKey}
                    onChange={e => {
                    setCbpKey(e.target.value);
                    validateForm();
                    }}
                    type="text"
                />
                <Form.Label>Coinbase Pro Secret</Form.Label>
                <FormControl
                    value={cbpSecret}
                    onChange={e => {
                    setCbpSecret(e.target.value);
                    validateForm();
                    }}
                    type="text"
                />
                <Form.Label>Coinbase Pro Passphrase</Form.Label>
                <FormControl
                    value={cbpPassphrase}
                    onChange={e => {
                    setCbpPassphrase(e.target.value);
                    validateForm();
                    }}
                    type="text"
                />
            </div>
            </FormGroup>
            <Button block disabled={false} type="submit">
            Register
            </Button>
            </form>
        </div>
    );
    let spinner = (<div className="loader">Loading...</div>);
    
    return (<> {showSpinner ? spinner : register} </>);
}

export default withRouter(Register);
