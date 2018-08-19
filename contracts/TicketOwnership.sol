pragma solidity ^0.4.24;

//Sources: 
// Open Zeppelin: https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/token/ERC721/ERC721BasicToken.sol
// CryptoKitties
// CryptoZombies


import "./ERC721.sol";
import "./ERC165.sol";
import "./TicketSale.sol";

import "zeppelin/math/SafeMath.sol";

contract TicketOwnership is TicketSale, ERC721, ERC165 {

	using SafeMath for uint256;

	mapping (bytes4 => bool) internal supportedInterfaces;
	mapping (uint256 => address) tokenApprovals;
	mapping (address => mapping (address => bool)) internal operatorApprovals;

	//TicketSale modifier to inherit the contract
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

	/// @notice Find the owner of an NFT
	/// @dev NFTs assigned to zero address are considered invalid, and queries
	///  about them do throw.
	/// @param _tokenId The identifier for an NFT
	/// @return The address of the owner of the NFT
	function ownerOf(uint256 _tokenId) public view returns (address) {
		address ticketOwner = ticketToOwner[_tokenId];
    	require(ticketOwner != address(0));
		return ticketToOwner[_tokenId];
	}

	/// @notice Transfers the ownership of an NFT from one address to another address
	/// @dev Throws unless `msg.sender` is the current owner, an authorized
	///  operator, or the approved address for this NFT. Throws if `_from` is
	///  not the current owner. Throws if `_to` is the zero address. Throws if
	///  `_tokenId` is not a valid NFT. When transfer is complete, this function
	///  checks if `_to` is a smart contract (code size > 0). If so, it calls
	///  `onERC721Received` on `_to` and throws if the return value is not
	///  `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`.
	/// @param _from The current owner of the NFT
	/// @param _to The new owner
	/// @param _tokenId The NFT to transfer
	/// @param data Additional data with no specified format, sent in call to `_to`
	function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) public payable {
		transferFrom(_from, _to, _tokenId);
	}

	/// @notice Transfers the ownership of an NFT from one address to another address
	/// @dev This works identically to the other function with an extra data parameter,
	///  except this function just sets data to "".
	/// @param _from The current owner of the NFT
	/// @param _to The new owner
	/// @param _tokenId The NFT to transfer
	function safeTransferFrom(address _from, address _to, uint256 _tokenId) public payable {
		safeTransferFrom(_from, _to, _tokenId, "");
	}

	/// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
	///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
	///  THEY MAY BE PERMANENTLY LOST
	/// @dev Throws unless `msg.sender` is the current owner, an authorized
	///  operator, or the approved address for this NFT. Throws if `_from` is
	///  not the current owner. Throws if `_to` is the zero address. Throws if
	///  `_tokenId` is not a valid NFT.
	/// @param _from The current owner of the NFT
	/// @param _to The new owner
	/// @param _tokenId The NFT to transfer
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

    	ticketToOwner[_tokenId] = address(0);

    	// Add token
	    ticketToOwner[_tokenId] = _to;
		ownerToTickets[_to].push(_tokenId);

	    emit Transfer(_from, _to, _tokenId);
	}

	/// @notice Change or reaffirm the approved address for an NFT
	/// @dev The zero address indicates there is no approved address.
	///  Throws unless `msg.sender` is the current NFT owner, or an authorized
	///  operator of the current owner.
	/// @param _approved The new approved NFT controller
	/// @param _tokenId The NFT to approve
	function approve(address _approved, uint256 _tokenId) external payable {
		address token_owner = ownerOf(_tokenId);
	    require(_approved != token_owner);
	    require(msg.sender == token_owner || isApprovedForAll(token_owner, msg.sender));

	    tokenApprovals[_tokenId] = _approved;
	    emit Approval(token_owner, _approved, _tokenId);
	}

	/// @notice Enable or disable approval for a third party ("operator") to manage
	///  all of `msg.sender`'s assets
	/// @dev Emits the ApprovalForAll event. The contract MUST allow
	///  multiple operators per owner.
	/// @param _operator Address to add to the set of authorized operators
	/// @param _approved True if the operator is approved, false to revoke approval
	function setApprovalForAll(address _operator, bool _approved) external {
		require(_operator != msg.sender);
    	operatorApprovals[msg.sender][_operator] = _approved;
   		emit ApprovalForAll(msg.sender, _operator, _approved);
	}

	/// @notice Get the approved address for a single NFT
	/// @dev Throws if `_tokenId` is not a valid NFT.
	/// @param _tokenId The NFT to find the approved address for
	/// @return The approved address for this NFT, or the zero address if there is none
	function getApproved(uint256 _tokenId) public view returns (address) {
		return tokenApprovals[_tokenId];
	}

	/// @notice Query if an address is an authorized operator for another address
	/// @param _owner The address that owns the NFTs
	/// @param _operator The address that acts on behalf of the owner
	/// @return True if `_operator` is an approved operator for `_owner`, false otherwise
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