const Log = require('../schemas/Log');
const nodemailer = require('nodemailer');
const User = require('../../users/models/users.model');

require('dotenv').config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rmiller07@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
});

let mailOptions = {
    from: 'rmiller07@gmail.com',
    to: 'rmiller07@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

module.exports = (type, message, logLevel, data, email) => {
    console.log("HEYYY WE IN THE LOGGER!!!",email)
    let log = new Log.model({type, message, logLevel, data})
    log.save( err => {
        if(err) console.log(err)
    })
    User.findByEmail(email).then(res=>{
        console.log(res);
        if(res.enableEmailAlerts){
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
        }
    })
    
}


