## Crypto-bot by Ryan Miller  

> :warning: **This app is designed to be self-hosted so that you never need to give anyone your CBP API keys**: Use at your own risk!

Crypto-bot is an open sourced app built with the idea of dollar-cost-averaging investments into Bitcoin. This app uses the Coinbase Pro (CBP) API to provide features and data not available via the CBP web interface, including the ability to schedule recurring orders at customizable limit prices and intervals. Using Crypto-bot, you can acheive much lower transaction fees than through other recurring-buy services (e.g. Swan, Coinbase standard, etc.).
  
Please use at your own risk, and never share your API keys.


<img src="http://g.recordit.co/nq23eeVnMA.gif"
     alt="App overveiw"
     style="margin-right: 0 auto;" />  
  

## Installation

This app depends on a MongoDB database. Please install MongoDB before building. 

> Clone the repo to your local machine
```
$   git clone https://github.com/TheRyanMiller/crytpo-bot
```
> At the root of the project, make a copy of the `.env.example` file, and rename it to simply `.env`. Populate this file with your Coinbase API keys and other environment variables (e.g. MongoDB connection string and credentials).  

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