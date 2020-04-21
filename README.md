## Crypto DCA Bot by Ryan Miller  

> :warning: **This app is under development, and not fully tested**: Use at your own risk!

Crypto DCA Bot is an open sourced app I built to dollar-cost-average investments into Bitcoin. This app contains several features not avaialbe via the official CBP web interface, including the ability to schedule recurring orders at customizable limit prices and intervals. It also makes available some trade data not normally visible via Coinbase Pro.   
  
Please use at your own risk, and never share your API keys.


<img src="http://g.recordit.co/nq23eeVnMA.gif"
     alt="App overveiw"
     style="margin-right: 0 auto;" />  
  

## Installation

> Clone the repo to your local machine
```
$   git clone https://github.com/TheRyanMiller/crytpo-bot
```
> At the root of the project, make a copy of the `.env.example` file, and rename it to simply `.env`. Populate this file with your Coinbase API keys and other environment variables.  

> Do the same for the `.env.example` file in the `/client` directory.  

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