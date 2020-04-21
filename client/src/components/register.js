import React, { useState } from 'react';
import { withRouter, useHistory } from "react-router-dom";
import { Button, Form, FormGroup, FormControl } from "react-bootstrap";
import { api } from "../apis/apiCalls";
import "../styles/login.css";


const Register = (props) =>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState("");

    function validateForm() {
        setIsValid(email.length > 0 && password.length > 0);
    }

    let register = ( 
        <div className="Login">
            <form>
            <FormGroup controlId="name">
            <Form.Label>Name</Form.Label>
            <FormControl
                autoFocus
                type="name"
                value={email}
                onChange={e => {
                setEmail(e.target.value)
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
            </FormGroup>
            <Button block disabled={false} type="submit">
            Register
            </Button>
            </form>
        </div>
    );
    
    return register;
}

export default withRouter(Register);
