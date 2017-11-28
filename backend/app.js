const express = require('express');
const bodyParser = require('body-parser');
const LoginContract = require('./login_contract.js');
const jwt = require('jsonwebtoken');
const cuid = require('cuid');
const cors = require('cors');

const loginContract = LoginContract.at(process.env.LOGIN_CONTRACT_ADDRESS || '0xCc724c8Ebc5785b9D2138C539A99eBd05aadaEa5');

// LoginAttempt specified in login.sol as event that signals logins in contracts
const loginAttempt = loginContract.LoginAttempt();

const challenges = {};
const successfulLogins = {};

loginAttempt.watch((error, event) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(event);

    const sender = event.args.sender.toLowerCase();

    // If challenge sent matches the one we generated, mark login as valid.
    if (challenges[sender] === event.args.challenge) {
        successfulLogins[sender] = true;
    }
});

const secret = process.env.JWT_SECRET || "my super secret passcode";

const app = express();
app.use(cors({
    origin: 'http://localhost:9080'
}))
app.use(bodyParser.json({ type: () => true }));

function validateJwt(req, res, next) {
    try {
        req.jwt = jwt.verify(req.body.jwt, secret, { 
            algorithms: ['HS256'] 
        });
        next();
    } catch(e) {
        res.sendStatus(401); // Unauthorized
    }
}

app.post('/login', (req, res) => {
    // Ethereum addresses are always 42 characters
    if (!req.body.address || req.body.address.length !== 42) {
        res.sendStatus(400);
        return;
    }

    req.body.address = req.body.address.toLowerCase();

    const challenge = cuid();
    challenges[req.body.address] = challenge;

    const token = jwt.sign({ 
        address: req.body.address, 
        access: 'finishLogin'
    }, secret);

    res.json({
        challenge: challenge,
        jwt: token
    });
});

app.post('/finishLogin', validateJwt, (req, res) => {
    if (!req.jwt || !req.jwt.address || req.jwt.access !== 'finishLogin') {
        res.sendStatus(400);
        return;
    }

    if (successfulLogins[req.jwt.address]) {
        delete successfulLogins[req.jwt.address];
        delete challenges[req.jwt.address];

        const token = jwt.sign({ 
            address: req.jwt.address, 
            access: 'full'
        }, secret);

        res.json({
            jwt: token,
            address: req.jwt.address
        });
    } else {
        res.sendStatus(202); // HTTP Accepted (not completed)
    }
});

app.post('/apiTest', validateJwt, (req, res) => {
    if (req.jwt.access !== 'full') {
        res.sendStatus(401); // Unauthorized
        return;
    }

    res.json({
        message: 'It works!'
    });
});

app.listen(process.env.PORT || 3000);
