const TicketSale = artifacts.require("./TicketOwnership.sol") //need ownership methods for test purposes
const tryCatch = require("./exceptions.js").tryCatch //for testing reverts
const errTypes = require("./exceptions.js").errTypes
	
contract('TicketSale', function(accounts) {

	// accounts
	const OWNER = accounts[0]
	const ALICE = accounts[1]
	const BOB = accounts[2]

	// constructor initial parameters
	// deployer.deploy(TicketSale, "Nirvana - Wrigley Field", "ipfshash", 50, 8, web3.toWei(1, "ether"));
	const NAME = "Nirvana - Wrigley Field"
	const IPFS_HASH = 'ipfshash'
	const MAX_TICKETS = 50
	const MAX_TICKETS_PER_PERSON = 8
	const TICKET_PRICE = web3.toWei(1, "ether")


	it("should manage normal and edge cases of buying tickets", async () => {
		let ticketsale = await TicketSale.deployed()
		// State of the contract should be "created" so it should not be possible to buy a ticket
        /*assert*/await tryCatch(
        	ticketsale.buyTicket( 2, {value: 2e+18, from: ALICE}), errTypes.revert
        )

        // Start sale, emits event
		await ticketsale.startSale({from: OWNER})
		
		// Alice tries to buy 2 tickets with little money
		/*assert*/await tryCatch(
			ticketsale.buyTicket( 2, {value: 1e+18, from: ALICE}), errTypes.revert
		)
		
		// Alice tries to buy more tickets than allowed per person
		/*assert*/await tryCatch(
			ticketsale.buyTicket( MAX_TICKETS_PER_PERSON + 1, {value: MAX_TICKETS_PER_PERSON*1e+18, from: ALICE}), errTypes.revert
		)
		
		// Alice buys 2 tickets with the right amount of money
 		await ticketsale.buyTicket( 2, {value: 2e+18, from: ALICE})
		aliceBalance = await ticketsale.balanceOf.call(ALICE)
		assert.equal(aliceBalance.toNumber(), 2, 'ticket balance incorrect, check buyTicket method')

		// Alice tries again to buy more tickets than allowed, now that she has two
		/*assert*/await tryCatch(
			ticketsale.buyTicket( MAX_TICKETS_PER_PERSON, {value: MAX_TICKETS_PER_PERSON*1e+18, from: ALICE}), errTypes.revert
		)

		// Sale is stopped
		await ticketsale.stopSale({from: OWNER})
		
		// Bob tries to buy tickets, but the sale has stopped
		/*assert*/await tryCatch(
			ticketsale.buyTicket( 1, {value: 1e+18, from: BOB}), errTypes.revert
		)

		// Sale starts again and tickets are sold out
		await ticketsale.startSale({from: OWNER})
		let soldTickets
		async function checkTickets(n) {
			soldTickets = await ticketsale.soldTickets.call()
			assert.equal(soldTickets.toNumber(), n, 'incorrect number of sold tickets, check buyTicket method')
		} 
		await checkTickets(2)
		await ticketsale.buyTicket( 6, {value: 6e+18, from: ALICE}) // 8 tickets sold
		await checkTickets(8)
		await ticketsale.buyTicket( 8, {value: 8e+18, from: accounts[3]}) // 16
		await checkTickets(16)
		await ticketsale.buyTicket( 8, {value: 8e+18, from: accounts[4]}) // 24
		await checkTickets(24)
		await ticketsale.buyTicket( 8, {value: 8e+18, from: accounts[5]}) // 32
		await checkTickets(32)
		await ticketsale.buyTicket( 8, {value: 8e+18, from: accounts[6]}) // 40
		await checkTickets(40)
		await ticketsale.buyTicket( 8, {value: 8e+18, from: accounts[7]}) // 48
		await checkTickets(48)
		await ticketsale.buyTicket( 2, {value: 2e+18, from: accounts[8]}) // 50
		await checkTickets(50)

		// Bob tries to buy tickets, but they are sold out
		/*assert*/await tryCatch(
			ticketsale.buyTicket( 5, {value: 5e+18, from: BOB}), errTypes.revert
		)

		// Owner adds more tickets
		await ticketsale.addMoreTickets(5, {from: OWNER})
		await ticketsale.startSale({from: OWNER})

		// Bob can now buy those tickets
		await ticketsale.buyTicket( 2, {value: 2e+18, from: BOB})
		bobBalance = await ticketsale.balanceOf.call(BOB)
		assert.equal(bobBalance.toNumber(), 2, 'ticket balance incorrect, check buyTicket method');
	});

	it("should change state variables of the contract", async () => {
		// setIPFSdata
		// addMoreTickets
		// setTicketPrice

		let ticketsale = await TicketSale.deployed()

		// Check initial constructor parameters
		let current_name, 


	});


});