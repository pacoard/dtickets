/*var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");*/

var TicketContract = artifacts.require("./TicketOwnership.sol");

module.exports = function(deployer) {
	// constructor(
	//    string _name, string _ipfsMetaData, uint32 _maxTickets, 
	//    uint8 _maxTicketsPerPerson, uint256 _ticketPrice
	// )
	deployer.deploy(TicketContract, "Nirvana - Wrigley Field", "ipfshash", 50, 8, web3.toWei(1, "ether"));
};
