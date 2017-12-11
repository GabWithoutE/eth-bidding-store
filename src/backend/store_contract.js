const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const abi = require('../../solidity/build/contracts/Store.json').abi;
const StoreContract = web3.eth.contract(abi);

module.exports = StoreContract;
