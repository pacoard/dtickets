pragma solidity ^0.4.24;


import "./Ownable.sol";

contract TicketSale is Ownable {

	mapping (uint256 => address) ticketToOwner; 
	mapping (address => uint256[]) ownerToTickets; // one person can buy more than one ticket

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

		soldTickets = 0; // not necessary?
		saleState = SaleState.Created;
	}

	// WARNING: gas cost can be extremely high (should keep qty VERY low)
	function buyTicket(uint8 qty) external payable onSale {
		// TODO force gas cost to be below a maximum (avoid gas wars) 
		// enough money
		require(msg.value >= qty*ticketPrice);
		// not buying more tickets than allowed
		require((maxTicketsPerPerson - getNumberOfTicketsByOwner(msg.sender)) >= qty);
		// enough tickets left
		require((maxTickets - nTickets) >= qty);

		uint256 _ticketID;

		for (uint8 i = 0; i < qty; i++) {
			_ticketID = generateTicketID(msg.sender);
			// update mappings
			ticketToOwner[_ticketID] = msg.sender;
			ownerToTickets[msg.sender].push(_ticketID);
			soldTickets++;
		}

		if (soldTickets >= maxTickets) {
			saleState = SaleState.SoldOut;
		}
	}

	function generateTicketID(address _address) private view returns (uint256) {
		// NOTE: Hopefully, this way there will not be any tickets that have the same ID.
		// Tickets are non refundable, so "nTickets" will never be the same number for 
		// two different ticket orders. Should be safe for transfers as well.
		return uint256(keccak256(abi.encodePacked(_address, soldTickets)));
	}


	function getNumberOfTicketsByOwner(address _ticketOwner) public view returns (uint8) {
		return uint8(ownerToTickets[_ticketOwner].length);
	}


	// ONLY OWNER FUNCTIONS

	function startSale() external onlyOwner {
		saleState = SaleState.Sale;
		emit Sale();
	}

	// Circuit Breaker
	function stopSale() public onlyOwner {
		saleState = SaleState.Closed;
		emit Closed();
	}

	function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
		ticketPrice = _ticketPrice;
	}

	function addMoreTickets(uint32 _nTickets) external onlyOwner {
		maxTickets += _nTickets;
		saleState = SaleState.Sale;
	}

}