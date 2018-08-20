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

	// contract to interact with
	let t_sale

	beforeEach('setup contract for each test', async function () {
		t_sale = await TicketSale.deployed()
	})

	it("should change state variables of the contract", async () => {
		// setIPFSdata
		// addMoreTickets
		// setTicketPrice
/*
		// Check initial constructor parameters (max tickets per person already tested in the following test)
		let curr_name = await t_sale.name()
		assert.equal(curr_name, NAME, 'initial name passed to constructor is wrong')
		let curr_ipfshash = await t_sale.ipfsMetaData()
		assert.equal(curr_ipfshash, IPFS_HASH, 'initial IPFS hash passed to constructor is wrong')
		let curr_maxtickets = await t_sale.maxTickets()
		assert.equal(curr_maxtickets.toNumber(), MAX_TICKETS, 'initial max tickets number passed to constructor is wrong')
		let curr_ticketprice = await t_sale.ticketPrice()
		assert.equal(curr_ticketprice.toNumber(), TICKET_PRICE, 'initial ticket price passed to constructor is wrong')

		// Check setter methods (should be accessible only by the owner)

		// SET IPFS META DATA
		await tryCatch(
        	t_sale.setIpfsMetaData("new hash", {from: ALICE}), errTypes.revert
        )
		await t_sale.setIpfsMetaData("new hash", {from: OWNER})
		

		// ADD MORE TICKETS
		await tryCatch(
        	t_sale.addMoreTickets(10, {from: ALICE}), errTypes.revert
        )
		await t_sale.addMoreTickets(10, {from: OWNER})
		

		// CHANGE TICKET PRICE
		await tryCatch(
        	t_sale.setTicketPrice(web3.toWei(3, "ether"), {from: ALICE}), errTypes.revert
        )
		await t_sale.setTicketPrice(web3.toWei(3, "ether"), {from: OWNER})
		


		curr_ipfshash = await t_sale.ipfsMetaData()
		assert.equal(await t_sale.ipfsMetaData(), "new hash", 'check setIpfsMetaData method')
		curr_maxtickets = await t_sale.maxTickets()
		assert.equal(curr_maxtickets.toNumber(), MAX_TICKETS + 10, 'check addMoreTickets method')
		curr_ticketprice = await t_sale.ticketPrice()
		assert.equal(curr_ticketprice.toNumber().toString(), web3.toWei(3, "ether"), 'check setTicketPrice method')
*/
	})


	it("should manage normal and edge cases of buying tickets", async () => {
		// State of the contract should be "created" so it should not be possible to buy a ticket
        /*assert*/await tryCatch(
        	t_sale.buyTicket( 2, {value: 2e+18, from: ALICE}), errTypes.revert
        )

        // Start sale, emits event
		await t_sale.startSale({from: OWNER})
		
		// Alice tries to buy 2 tickets with little money
		/*assert*/await tryCatch(
			t_sale.buyTicket( 2, {value: 1e+18, from: ALICE}), errTypes.revert
		)
		
		// Alice tries to buy more tickets than allowed per person
		/*assert*/await tryCatch(
			t_sale.buyTicket( MAX_TICKETS_PER_PERSON + 1, {value: MAX_TICKETS_PER_PERSON*1e+18, from: ALICE}), errTypes.revert
		)
		
		// Alice buys 2 tickets with the right amount of money
 		await t_sale.buyTicket( 2, {value: 2e+18, from: ALICE})
		aliceBalance = await t_sale.balanceOf(ALICE)
		assert.equal(aliceBalance.toNumber(), 2, 'ticket balance incorrect, check buyTicket method')

		// Alice tries again to buy more tickets than allowed, now that she has two
		/*assert*/await tryCatch(
			t_sale.buyTicket( MAX_TICKETS_PER_PERSON, {value: MAX_TICKETS_PER_PERSON*1e+18, from: ALICE}), errTypes.revert
		)

		// Sale is stopped
		await t_sale.stopSale({from: OWNER})
		
		// Bob tries to buy tickets, but the sale has stopped
		/*assert*/await tryCatch(
			t_sale.buyTicket( 1, {value: 1e+18, from: BOB}), errTypes.revert
		)

		// Sale starts again and tickets are sold out
		await t_sale.startSale({from: OWNER})
		let soldTickets
		async function checkTickets(n) {
			soldTickets = await t_sale.soldTickets()
			assert.equal(soldTickets.toNumber(), n, 'incorrect number of sold tickets, check buyTicket method')
		} 
		await checkTickets(2)
		await t_sale.buyTicket( 6, {value: 6e+18, from: ALICE}) // 8 tickets sold
		await checkTickets(8)
		await t_sale.buyTicket( 8, {value: 8e+18, from: accounts[3]}) // 16
		await checkTickets(16)
		await t_sale.buyTicket( 8, {value: 8e+18, from: accounts[4]}) // 24
		await checkTickets(24)
		await t_sale.buyTicket( 8, {value: 8e+18, from: accounts[5]}) // 32
		await checkTickets(32)
		await t_sale.buyTicket( 8, {value: 8e+18, from: accounts[6]}) // 40
		await checkTickets(40)
		await t_sale.buyTicket( 8, {value: 8e+18, from: accounts[7]}) // 48
		await checkTickets(48)
		await t_sale.buyTicket( 2, {value: 2e+18, from: accounts[8]}) // 50 => max tickets sold
		await checkTickets(50)

		// Bob tries to buy tickets, but they are sold out
		/*assert*/await tryCatch(
			t_sale.buyTicket( 5, {value: 5e+18, from: BOB}), errTypes.revert
		)

		// Owner adds more tickets
		await t_sale.addMoreTickets(5, {from: OWNER})
		await t_sale.startSale({from: OWNER})

		// Bob can now buy those tickets
		await t_sale.buyTicket( 2, {value: 2e+18, from: BOB})
		bobBalance = await t_sale.balanceOf(BOB)
		assert.equal(bobBalance.toNumber(), 2, 'ticket balance incorrect, check buyTicket method')
	})


})