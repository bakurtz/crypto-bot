## Crypto DCA Bot by Ryan Miller  

> :warning: **This app is under development, and not fully tested**: Use at your own risk!

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)  

Crypto DCA Bot is an open sourced app I built to dollar-cost-average investments into Bitcoin. This app contains several features not avaialbe via the official CBP web interface, including the ability to schedule recurring orders at customizable limit prices and intervals. It also makes available some trade data not normally visible via CBP.   
  
Please use at your own risk, and never share your API keys.


<img src="http://g.recordit.co/nq23eeVnMA.gif"
     alt="App overveiw"
     style="margin-right: 0 auto;" />  
  

## Installation

> Clone the repo to your local machine
```
$   git clone https://github.com/TheRyanMiller/crytpo-bot
```
> Change into the project directory and install the server-side NPM packages, and then the client-side NPM packages.
```
$   cd crypto-bot
$   npm install
$   cd client
$   npm install
```

> Issue this command from the root `/` directory to launch the server locally using the typescript engine.
```
$   ts-node server.js
```

> Issue this command from the `/client` directory to launch the app locally
```
$   npm run
```