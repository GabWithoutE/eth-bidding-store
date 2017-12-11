const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const abi = require('../../solidity/build/contracts/Login.json').abi;
const LoginContract = web3.eth.contract(abi);

module.exports = LoginContract;
