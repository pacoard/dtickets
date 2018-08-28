pragma solidity ^0.4.24;


import "zeppelin/ownership/Ownable.sol";


/**
  * @title Ticket Sale
  * This contract contains the sale logic. Mainly methods for
  *	the owner to manipulate the sale, mappings with the necessary
  *	information to keep track of the owners, parameters of the
  *	sale and a function for customers to buy tickets
  */
contract TicketSale is Ownable {

	mapping (uint256 => address) public ticketToOwner; 
	mapping (address => uint256[]) public ownerToTickets; // one person can buy more than one ticket

	// Name of the event
	string public name;

	// Metadata stored on IPFS
	string public ipfsMetaData;

	// Max number of tickets on sale
	uint32 public maxTickets;

	// Max number of tickets that one person can buy
	uint8 public maxTicketsPerPerson;

	// Number of sold tickets
	uint32 public soldTickets;

	// Price in wei per Ticket
	uint256 public ticketPrice;

	// State of the sale
	enum SaleState { 
		Created, 
		Sale, 
		SoldOut,
		Closed
	}

    SaleState saleState;

	modifier created() 	{ require(saleState == SaleState.Created); 	_;}
	modifier onSale() 	{ require(saleState == SaleState.Sale); 	_;}
	modifier soldOut() 	{ require(saleState == SaleState.SoldOut); 	_;}
	modifier closed() 	{ require(saleState == SaleState.Closed); 	_;}

	event Sale();
	event SoldOut();
	event Closed();

	constructor(
		string _name, 
		string _ipfsMetaData, 
		uint32 _maxTickets, 
		uint8 _maxTicketsPerPerson, 
		uint256 _ticketPrice
	) public {
		name = _name;
		ipfsMetaData = _ipfsMetaData;
		maxTickets = _maxTickets;
		maxTicketsPerPerson = _maxTicketsPerPerson;
		ticketPrice = _ticketPrice;

		saleState = SaleState.Created;
	}

	// WARNING: gas cost can be extremely high (should keep _nTickets VERY low)
	/**
	  * @notice Buys _nTickets for msg.sender
	  * @dev Throws if: 
	  * - not enough ether was sent
	  * - client would end up having more tickets than allowed
	  * - there are not enough tickets on sale
	  * @param _nTickets the number of tickets to buy
	  */
	function buyTicket(uint8 _nTickets) external payable onSale {
		// TODO force gas cost to be below a maximum (avoid gas wars) 
		// enough money
		require(msg.value >= _nTickets*ticketPrice);
		// not buying more tickets than allowed
		require((maxTicketsPerPerson - ownerToTickets[msg.sender].length) >= _nTickets);
		// enough tickets left
		require((maxTickets - soldTickets) >= _nTickets);

		uint256 _ticketID;

		for (uint8 i = 0; i < _nTickets; i++) {
			_ticketID = generateTicketID();
			// update mappings
			ticketToOwner[_ticketID] = msg.sender;
			ownerToTickets[msg.sender].push(_ticketID);
			soldTickets++;
		}

		if (soldTickets >= maxTickets) {
			saleState = SaleState.SoldOut;
		}
	}

	/**
	  * @notice Generates a unique uint256 ID for the last sold ticket
	  * @return keccak256 of msg.sender and the number of sold tickets
	  */
	function generateTicketID() private view returns (uint256) {
		// NOTE: Hopefully, this way there will not be any tickets that have the same ID.
		// Tickets are non refundable, so "soldTickets" will never be the same number for 
		// two different ticket orders. Should be safe for transfers as well.
		return uint256(keccak256(abi.encodePacked(msg.sender, soldTickets)));
	}


	// ONLY OWNER FUNCTIONS
	/**
	  * @notice Changes the state of the contract to Sale
	  */
	function startSale() external onlyOwner {
		saleState = SaleState.Sale;
		emit Sale();
	}
	/**
	  * @notice Updates the IPFS hash of this sale
	  * @param _ipfsMetaData the new IPFS hash
	  */
	function setIpfsMetaData(string _ipfsMetaData) external onlyOwner {
		ipfsMetaData = _ipfsMetaData;
	}
	/**
	  * @notice Changes the state of the contract to Closed
	  */
	function stopSale() public onlyOwner {
		saleState = SaleState.Closed;
		emit Closed();
	}
	/**
	  * @notice Updates the price of the tickets
	  * @param _ticketPrice the new ticket price
	  */
	function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
		ticketPrice = _ticketPrice;
	}

	/**
	  * @notice Buys _nTickets for msg.sender
	  * @dev Throws if: 
	  * - the total number of tickets overflows maxTickets (uint32)
	  * @param _nTickets the number of tickets to add to the sale
	  */
	function addMoreTickets(uint32 _nTickets) external onlyOwner {
		// check possible overflow of maxTickets
		require(maxTickets + _nTickets <= 2**32 - 1);
		maxTickets += _nTickets;
	}

	// A way to stop the sale and withdraw all the money
	/**
	  * @notice Destroys the contract and sends whatever balance it has to the owner
	  */
	function kill() external onlyOwner {
		selfdestruct(owner);
	}

}