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

	struct User {
		address adr;
		bytes32 email;
		bytes32 name;
		uint256 balance;
		Bid[] bids;
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
		Bid[] bids;
	}

	struct Receipt {
		bytes productId;
		uint256 price;
	}

	function Store() internal {
		ownerId = msg.sender;
		storeName = "The Amazing CS 512 Store";
	}

	function newProduct(uint256 id, bytes32 name, bytes32 description, uint256 price)
						isOwner public returns (bool success) {
		Bid[] storage emptyBids;
		var product = Product(id, name, description, price, price, emptyBids);
		if (isValidProduct(product)) {
			products[id] = product;
			ProductCreated(id);
			return true;
		}
		ProductCreationFailed(id);
		return false;
	}

	function deleteProduct(uint256 id) isOwner public returns (bool success) {
		Product storage product = products[id];
		if (product.id == id) {
			delete products[id];
			DeleteProduct(id);
			return true;
		}
		DeleteProductFailed(id);
		return false;
	}

	function newUser(address _address, bytes32 _email, bytes32 _name, uint256 _balance)
					isOwner public returns (bool success) {
		if (_address != address(0)) {
			Bid[] storage emptyBids;
			User memory user = User({ adr: _address, email: _email,
									name: _name, balance: _balance,
									bids: emptyBids
								});
			users[_address] = user;
			UserCreated(_address);
			return true;
		}
		UserCreatedFailed(_address);
		return false;
	}

	function placeBid(uint256 id, uint256 bidPrice) public returns (bool success) {
		address userAddress = msg.sender;
		User storage user = users[userAddress];
		Product storage product = products[id];

		if (bidPrice < product.price) {
			BidRejected(userAddress, id, bidPrice);
			return false;
		}

		Bid memory newBid = Bid(id, userAddress, bidPrice);
		user.bids.push(newBid);
		product.bids.push(newBid);
		BidPlaced(userAddress, id, bidPrice);
		return true;
	}

	function checkoutProduct(uint256 id, uint256 bidPrice) public returns (bool success) {
		User storage user = users[msg.sender];
		if (user.balance >= bidPrice) {
			var (bidSuccess, bidIndex) = userDidBid(user, id, bidPrice);
			if (bidSuccess) {
				user.balance -= bidPrice;
				delete user.bids[bidIndex];
				delete products[id];
				storeBalance += bidPrice;
				CheckoutSuccess(user.adr, id, bidPrice);
				return true;
			}
		}
		CheckoutFailed(user.adr, id, bidPrice);
		return false;
	}

	function userDidBid(User user, uint256 id, uint256 bidPrice) public pure returns (bool success, uint256 bidIndex) {
		for (uint256 i = 0; i < user.bids.length; i++) {
			if (user.bids[i].productId == id && user.bids[i].price == bidPrice) {
				return (true, i);
			}
		}
		return (false, uint256(-1));
	}

	function getBalance() constant public returns (uint256 _balance) {
		return users[msg.sender].balance;
    }

    function getStoreBalance() isOwner constant public returns (uint256 _storeBalance) {
    	return storeBalance;
    }

	function isValidProduct(Product product) public pure returns (bool valid) {
		return product.price > 0;
	}

}
