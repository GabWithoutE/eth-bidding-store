const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const abi = JSON.parse('[{"constant":true,"inputs":[],"name":"ownerId","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBalance","outputs":[{"name":"_balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_email","type":"bytes32"},{"name":"_name","type":"bytes32"},{"name":"_balance","type":"uint256"}],"name":"newUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"storeName","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"bidPrice","type":"uint256"}],"name":"placeBid","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"name","type":"bytes32"},{"name":"description","type":"bytes32"},{"name":"price","type":"uint256"}],"name":"newProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwnerId","type":"address"}],"name":"newOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"bidPrice","type":"uint256"}],"name":"checkoutProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"userBidLength","type":"uint256"},{"name":"userAddress","type":"address"},{"name":"id","type":"uint256"},{"name":"bidPrice","type":"uint256"}],"name":"userDidBid","outputs":[{"name":"success","type":"bool"},{"name":"bidIndex","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"productId","type":"uint256"}],"name":"generateBidId","outputs":[{"name":"bidId","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"userAddress","type":"address"}],"name":"convert","outputs":[{"name":"uAddress256","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"deleteProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getStoreBalance","outputs":[{"name":"_storeBalance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BidPlaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"BidRejected","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"ProductCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"ProductCreationFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"DeleteProduct","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"DeleteProductFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"}],"name":"UserCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"}],"name":"UserCreatedFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"CheckoutSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"price","type":"uint256"}],"name":"CheckoutFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"}],"name":"StartupStore","type":"event"}]')
const StoreContract = web3.eth.contract(abi);
// PASTE HERE
const contractInstance = StoreContract.at('0xa0d89ee2818dd0888bb7e024d6bbd0777c5d3b0c');
console.log(contractInstance)


var users= [{"userid":"owner","pwd":"owner1","id":'12345678'},{"userid":"user_1","pwd":"pwd1","id":'0000001'},{"userid":"user_2","pwd":"pwd2","id":'0000002'}]

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
			console.log("hello")
			console.log(web3.eth.accounts[0])
			console.log(contractInstance)
			setUserToSession(users[i]);

			/*if(user_id == "owner")
			{

				location.href="./owner.html";
			}
			else
			{
				location.href="./user.html";
			}*/
			location.href="./user.html";
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
