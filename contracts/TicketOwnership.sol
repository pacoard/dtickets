pragma solidity ^0.4.24;

// Sources: 
// - Open Zeppelin: https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721BasicToken.sol
// - CryptoKitties
// - CryptoZombies


import "./ERC721.sol";
import "./ERC165.sol";
import "./TicketSale.sol";

import "zeppelin/math/SafeMath.sol";


/** @title Ticket Ownership
  * This contract is the one that is deployed for this dApp.
  * It inherits TicketSale in order to deploye all the logic,
  * and it adds ERC721 nature to the ticket tokens. In order
  * for that to happen, ERC165 is also necessary.
  * 
  * The documentation for all the implemented methods in this
  * file are in its respective interfaces contracts
  */
contract TicketOwnership is TicketSale, ERC721, ERC165 {

	using SafeMath for uint256;

	mapping (bytes4 => bool) internal supportedInterfaces;
	mapping (uint256 => address) tokenApprovals;
	mapping (address => mapping (address => bool)) internal operatorApprovals;

	// TicketSale modifier to inherit the contract
	constructor(
		string _name, 
		string _ipfsMetaData, 
		uint32 _maxTickets, 
		uint8 _maxTicketsPerPerson, 
		uint256 _ticketPrice
	) public TicketSale(_name, _ipfsMetaData, _maxTickets, _maxTicketsPerPerson, _ticketPrice) { 
		//ERC165 compliant: supports ER721 interface
		//supportedInterfaces[this.supportsInterface.selector] = true;
		supportedInterfaces[0x80ac58cd] = true;
		
	}

	function supportsInterface(bytes4 interfaceID) external view returns (bool){
		return supportedInterfaces[interfaceID];
	}


	event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
	event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);
	event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

	function balanceOf(address _owner) external view returns (uint256) {
		require(_owner != address(0));
		return ownerToTickets[_owner].length;
	}

	function ownerOf(uint256 _tokenId) public view returns (address) {
		address ticketOwner = ticketToOwner[_tokenId];
    	require(ticketOwner != address(0));
		return ticketToOwner[_tokenId];
	}

	function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) public payable {
		transferFrom(_from, _to, _tokenId);
	}

	function safeTransferFrom(address _from, address _to, uint256 _tokenId) public payable {
		safeTransferFrom(_from, _to, _tokenId, "");
	}

	function transferFrom(address _from, address _to, uint256 _tokenId) public payable {
		require(isApprovedOrOwner(msg.sender, _tokenId));
	    require(_to != address(0));

	    tokenApprovals[_tokenId] = address(0);

	    // Delete token
	    for (uint i = 0; i < ownerToTickets[_from].length-1; i++){
            if (ownerToTickets[_from][i] == _tokenId) {
            	/*// delete token
            	delete ownerToTickets[_from][i];
            	// fill the empty spot with the last element
            	ownerToTickets[_from][i] = ownerToTickets[_from][ownerToTickets[_from].length-1];
            	// delete last element
            	delete ownerToTickets[_from][ownerToTickets[_from].length-1];
            	// stop loop, we already found the ticket to delete
            	ownerToTickets[_from].length--;
            	*/
            	// BETTER WAY
            	// Assign last token to the token we are transferring
            	ownerToTickets[_from][i] = ownerToTickets[_from][ownerToTickets[_from].length-1];
            	// Delete duplicate token at the end
            	ownerToTickets[_from].length--;
            	break;
            }
        }

    	// Add token
	    ticketToOwner[_tokenId] = _to;
		ownerToTickets[_to].push(_tokenId);

	    emit Transfer(_from, _to, _tokenId);
	}

	function approve(address _approved, uint256 _tokenId) external payable {
		address token_owner = ownerOf(_tokenId);
	    require(_approved != token_owner);
	    require(msg.sender == token_owner || isApprovedForAll(token_owner, msg.sender));

	    // The receiver of the token can't possess more tokens than maxTicketsPerPerson
	    require(ownerToTickets[_approved].length < maxTicketsPerPerson);

	    tokenApprovals[_tokenId] = _approved;
	    emit Approval(token_owner, _approved, _tokenId);
	}

	function setApprovalForAll(address _operator, bool _approved) external {
		require(_operator != msg.sender);
    	operatorApprovals[msg.sender][_operator] = _approved;
   		emit ApprovalForAll(msg.sender, _operator, _approved);
	}

	function getApproved(uint256 _tokenId) public view returns (address) {
		return tokenApprovals[_tokenId];
	}

	function isApprovedForAll(address _owner, address _operator) public view returns (bool) {
		return operatorApprovals[_owner][_operator];
	}

	/**
	 * @dev Returns whether the given spender can transfer a given token ID
	 * @param _spender address of the spender to query
	 * @param _tokenId uint256 ID of the token to be transferred
	 * @return bool whether the msg.sender is approved for the given token ID,
	 *  is an operator of the owner, or is the owner of the token
    */
  	function isApprovedOrOwner(address _spender, uint256 _tokenId) internal view returns (bool) {
	    address token_owner = ownerOf(_tokenId);
	    return (
	      _spender == token_owner ||
	      getApproved(_tokenId) == _spender ||
	      isApprovedForAll(token_owner, _spender)
	    );
  	}

  	function ticketsOf(address _owner) external view returns (uint256[]) {
  		return ownerToTickets[_owner];
  	}

}