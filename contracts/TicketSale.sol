pragma solidity ^0.4.24;


import "./Ownable.sol";

contract TicketSale is Ownable {

	mapping (uint256 => address) ticketToOwner; 
	mapping (address => uint256[]) ownerToTickets; // one person can buy more than one ticket

	// Name of the event
	string name;

	// Metadata stored on IPFS
	string ipfsMetaData;

	// Max number of tickets on sale
	uint32 maxTickets;

	// Max number of tickets that one person can buy
	uint8 maxTicketsPerPerson;

	// Number of sold tickets
	uint32 nTickets;

	// Price in wei per Ticket
	uint256 ticketPrice;

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

		nTickets = 0; // not necessary?
		saleState = SaleState.Created;
	}

	function buyTicket(uint8 qty) external payable onSale {
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
			ownerToTickets[msg.sender][getNumberOfTicketsByOwner(msg.sender)] = _ticketID;
			nTickets++;
		}

		if (nTickets == maxTickets) {
			saleState = SaleState.SoldOut;
		}
	}

	function generateTicketID(address _address) private returns (uint256) {
		// NOTE: Hopefully, this way there will not be any tickets that have the same ID.
		// Tickets are non refundable, so "nTickets" will never be the same number for 
		// two different ticket orders. Should be safe for transfers as well.
		return uint256(keccack256(_address, nTickets));
	}


	function getNumberOfTicketsByOwner(address _ticketOwner) public view returns (uint256) {
		return ownerToTickets[_ticketOwner].length;
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

	function addMoreTickets(uint256 _nTickets) external onlyOwner {
		nTickets += _nTickets;
		saleState = SaleState.Sale;
	}


}