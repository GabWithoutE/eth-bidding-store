pragma solidity ^0.4.17;

contract Login {
	
	event LoginAttempt(address sender, string challenge);

	function login(string challenge) {
		LoginAttempt(msg.sender, challenge);
	}

}
