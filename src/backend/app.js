const express = require('express');
const bodyParser = require('body-parser');
const StoreContract = require('./store_contract.js');
const jwt = require('jsonwebtoken');
const cuid = require('cuid');
const cors = require('cors');

const storeContract = StoreContract.at(process.env.STORE_CONTRACT_ADDRESS || '0x955586cae4cdd33233b6913a6da2c3c43295aa5e');

// StartupStore specified in Store.sol as event that signals starting store
const startupStoreAttempt = storeContract.StartupStore();

startupStoreAttempt.watch((error, event) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(event);

    const sender = event.args.sender.toLowerCase();
});

const secret = process.env.JWT_SECRET || "my super secret passcode";

const app = express();
app.use(cors({
    origin: 'http://localhost:9080'
}))
app.use(bodyParser.json({ type: () => true }));

app.listen(process.env.PORT || 3000);
