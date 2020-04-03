import axios from 'axios';
require('dotenv').config();


const x = () => {
    //Prepare API config
    axios.get('http://localhost:3001/api/getOpenOrders?byLastSync=true')
    .then((resp) => {
            console.log("Successful DB CALL");
    })
    .catch(err=>{
        console.log("FAIL!");
    })
}

const y = () => {
    let instance = axios.create({
        baseURL: process.env.API_URL,
        timeout: 10000,
        headers: {}
    });
    instance.get('/getOpenOrders?byLastSync=true')
    .then((resp) => {
            console.log("Successful DB CALL");
            console.log(process.env.API_URL)
    })
    .catch(err=>{
        console.log(process.env.API_URL)
        console.log(err)
        console.log("FAIL!");
    })
}


x();
y();