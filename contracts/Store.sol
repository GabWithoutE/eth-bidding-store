pragma solidity ^0.4.17;

import "./ProductOwner.sol";

contract Store is ProductOwner {
	bytes32 public storeName;
	uint256 private storeBalance;

	mapping (address => User) users;
	mapping (uint256 => Product) products;

	event BidPlaced(address user, uint256 id, uint256 price);
	event BidRejected(address user, uint256 id, uint256 price);

	event ProductCreated(uint256 id);
	event ProductCreationFailed(uint256 id);

	event DeleteProduct(uint256 id);
	event DeleteProductFailed(uint256 id);

	event UserCreated(address user);
	event UserCreatedFailed(address user);

	event CheckoutSuccess(address user, uint256 id, uint256 price);
	event CheckoutFailed(address user, uint256 id, uint256 price);

	event StartupStore(address sender);

	struct User {
		address adr;
		bytes32 email;
		bytes32 name;
		uint256 balance;
		mapping(bytes32 => Bid) bids;
	}

	struct Bid {
		uint256 productId;
		address adr;
		uint256 price;
	}

	struct Product {
		uint256 id;
		bytes32 name;
		bytes32 description;
		uint256 price;
		uint256 startingPrice;
		address lister;
		Bid topBid;
		mapping(bytes32 => Bid) bids;
	}

	struct Receipt {
		bytes productId;
		uint256 price;
	}

	function Store() public {
		ownerId = msg.sender;
		storeName = "The Amazing CS 512 Store";
		StartupStore(msg.sender);
	}

	function newProduct(uint256 id, bytes32 name, bytes32 description, uint256 price)
						public returns (bool success) {
		Product memory product = Product(id, name, description, price, price, msg.sender, Bid(0, 0, 0));
		if (product.price > 0) {
			products[id] = product;
			ProductCreated(id);
			return true;
		}
		ProductCreationFailed(id);
		return false;
	}

	function deleteProduct(uint256 id) public returns (bool success) {
		Product storage product = products[id];
		if (product.id == id) {
			delete products[id];
			DeleteProduct(id);
			return true;
		}
		DeleteProductFailed(id);
		return false;
	}

	function newUser(bytes32 _email, bytes32 _name, uint256 _balance)
					isOwner public returns (bool success) {
		if (users[msg.sender].adr != address(0)) {
			User memory user = User({ adr: msg.sender, email: _email,
									name: _name, balance: _balance
								});
			users[msg.sender] = user;
			/* UserCreated(_address); */
			return true;
		}
		/* UserCreatedFailed(_address); */
		return false;
	}

	function placeBid(uint256 id, uint256 bidPrice) public payable returns (bool success) {
		address userAddress = msg.sender;
		User storage user = users[userAddress];
		Product storage product = products[id];

		if (user.balance < bidPrice || bidPrice < product.price) {
			BidRejected(userAddress, id, bidPrice);
			return false;
		}

		Bid memory newBid = Bid(id, userAddress, bidPrice);
		bytes32 bidId = generateBidId(userAddress, id);
		user.bids[bidId] = newBid;
		product.bids[bidId] = newBid;
		if (bidPrice > product.topBid.price) {
			product.topBid = newBid;
		}
		BidPlaced(userAddress, id, bidPrice);
		return true;
	}

	function generateBidId(address user, uint256 productId) public returns (bytes32 bidId) {
		uint256 combined = convert(user) + productId;
		return keccak256(combined);
	}

	function convert(address userAddress) public returns (uint256 uAddress256) {
		return uint256(userAddress);
	}

	function userExists () public returns (bool exists){
		return users[msg.sender].adr != msg.sender;
	}

	function yo() constant public returns (bool hello) {
		return true;
	}

	function getBalance() constant public returns (uint256 _balance) {
		return users[msg.sender].balance;
    }

    function getStoreBalance() constant public returns (uint256 _storeBalance) {
    	return storeBalance;
    }

    function endBid(uint256 productId) public payable {
    	Bid storage winningBid = products[productId].topBid;
    	User storage winner = users[winner.adr];
    	uint256 bidPrice = winningBid.price;
		if (winner.balance >= bidPrice) {
			winner.balance -= bidPrice;
			products[productId].lister.transfer(bidPrice); // payout lister
			delete winner.bids[generateBidId(winner.adr, productId)];
			delete products[productId];
		}
    }

}
