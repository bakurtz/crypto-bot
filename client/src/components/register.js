import React, { useState } from 'react';
import { withRouter  } from "react-router-dom";


const Login = (props) =>{
    const [username, setUsername] = useState({});
    let login = ( 
    <div>
        <input />
    </div>
    );
    
    return login;
}

export default withRouter(Login);
