pragma solidity ^0.4.17;

contract ProductOwner {
	address public ownerId;

	function ProductOwner() public {
		ownerId = msg.sender;
	}

	modifier isOwner() {
		require(msg.sender == ownerId);
		_;
	}

	function newOwner(address newOwnerId) isOwner public {
		if (newOwnerId != address(0) && newOwnerId != ownerId) {
			ownerId = newOwnerId;
		}
	}
}
