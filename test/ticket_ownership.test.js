// https://gist.github.com/cipherzzz/fe4703c27e79c31b345870aafdd98391#file-erc721-spec-js

const TicketOwnership = artifacts.require("./TicketOwnership.sol") //need ownership methods for test purposes
const tryCatch = require("./exceptions.js").tryCatch //for testing reverts
const errTypes = require("./exceptions.js").errTypes

function getTicketIDs(bns) {
	for (i = 0; i < bns.length; i++) {
		bns[i] = bns[i].toString().split('e+')[0].replace('.', '')
	}
	return bns
}

contract('TicketOwnership', function(accounts) {
	// accounts
	const OWNER = accounts[0]
	const ALICE = accounts[1]
	const BOB = accounts[2]

	// contract to interact with
	let t_ownership
	let initialAliceTickets, initialAliceBalance
	let initialBobTickets, initialBobBalance

	beforeEach('set Alice and Bob as owners of some tickets', async function () {
        t_ownership = await TicketOwnership.deployed()
		await t_ownership.startSale({from: OWNER})

		// buyTicket method tested in ticket_sale.test.js
		await t_ownership.buyTicket( 2, {value: 2e+18, from: ALICE})
		await t_ownership.buyTicket( 1, {value: 1e+18, from: BOB})

		initialAliceTickets = getTicketIDs(await t_ownership.ticketsOf(ALICE))
		initialBobTickets = getTicketIDs(await t_ownership.ticketsOf(BOB))
		
		initialAliceBalance = (await t_ownership.balanceOf(ALICE)).toNumber()
		initialBobBalance = (await t_ownership.balanceOf(BOB)).toNumber()
    })

	// test ownerOf and balanceOf
	it("should get owner by ticket", async () => {

		// test balanceOf
		expect(initialAliceTickets.length).to.equal(initialAliceBalance)
		expect(initialBobTickets.length).to.equal(initialBobBalance)

		// test ownerOf
		expect(await t_ownership.ownerOf(initialAliceTickets[0])).to.equal(ALICE)
		expect(await t_ownership.ownerOf(initialAliceTickets[1])).to.equal(ALICE)
		expect(await t_ownership.ownerOf(initialBobTickets[0])).to.equal(BOB)
	})

	// test balanceOf
	it("should get balance of owners", async () => {

		// test balanceOf
		expect(initialAliceTickets.length).to.equal(initialAliceBalance)
		expect(initialBobTickets.length).to.equal(initialBobBalance)
	})

	// test transfer of tokens
	it("should handle token transfers", async () => {

		// Approve a transfer - Alice wants to send a ticket to Bob
		await t_ownership.approve(BOB, initialAliceTickets[0], {from: ALICE})
		// Execute transfer
		await t_ownership.transferFrom(ALICE, BOB, initialAliceTickets[0], {from: ALICE})
		
		// The ticket should now belong to Bob
		expect(await t_ownership.ownerOf(initialAliceTickets[0])).to.equal(BOB)
		// Bob's balance should have increased by 1 ticket
		let newBobBalance = (await t_ownership.balanceOf(BOB)).toNumber()
		expect(newBobBalance).to.equal(initialBobBalance+1)
	})

})