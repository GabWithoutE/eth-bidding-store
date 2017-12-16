var Web3 = require('web3'),
		tContract = require('truffle-contract'),
		path = require('path'),
		MyContractJson = require('../build/contracts/Store.json'),
		$ = require('jquery')

var web3Provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var MyContract = tContract(MyContractJson)
MyContract.setProvider(web3Provider.currentProvider)

var ethAccounts = web3Provider.eth.accounts

var users= [{"userid":"owner","pwd":"owner1","id":'12345678', "ethAccntAddress": ''},{"userid":"user_1","pwd":"pwd1","id":'0000001', "ethAccntAddress": ''},{"userid":"user_2","pwd":"pwd2","id":'0000002', "ethAccntAddress": ''}]

// $( document ).ready(function() {
for (i = 0; i < users.length; i++) {
	users[i].ethAccntAddress = ethAccounts[i]
}
// })

console.log(ethAccounts[0])
console.log(users[0].ethAccntAddress)

// var hi = "hi"
var logged_id;
global.validate_user = function()
{

	console.log(users.length);
	var isValidUser = false;
	for(i=0;i<users.length;i++)
	{
		var user_id = document.getElementById('uid').value;
		var password = document.getElementById('pwd').value;

		if( user_id== users[i].userid && password==users[i].pwd)
		{
			isValidUser = true;
			setUserToSession(users[i]);
    
			if(user_id == "owner")
			{
    
				location.href="./owner.html";
			}
			else
			{
				location.href="./user.html";
			}
		}

	}
	if(!isValidUser)
	{
		alert("Invalid login details!!");
	}

}

function setUserToSession(user)
{

	if (typeof(Storage) !== "undefined")
	{
    		sessionStorage.setItem("loggedUser",JSON.stringify(user));

	}
	else
	{
    		alert("Sorry!! not supported")
	}

}
