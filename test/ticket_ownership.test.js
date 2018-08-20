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

	beforeEach('setup contract for each test', async function () {
        t_ownership = await TicketOwnership.deployed()
		await t_ownership.startSale({from: OWNER})

		// buyTicket method tested in ticket_sale.test.js
		await t_ownership.buyTicket( 2, {value: 2e+18, from: ALICE})
		await t_ownership.buyTicket( 1, {value: 1e+18, from: BOB})
    })

	// test ownerOf and balanceOf
	it("should get owner by ticket and balance of owners", async () => {

		let aliceTickets = getTicketIDs(await t_ownership.ticketsOf(ALICE))
		let bobTickets = getTicketIDs(await t_ownership.ticketsOf(BOB))
		
		let aliceBalance = await t_ownership.balanceOf(ALICE)
		let bobBalance = await t_ownership.balanceOf(BOB)

		// test balanceOf
		assert.equal(aliceTickets.length, aliceBalance, 'check balanceOf method')
		assert.equal(bobTickets.length, bobBalance, 'check balanceOf method')

		// test ownerOf
		assert.equal(await t_ownership.ownerOf(aliceTickets[0]), ALICE, 'check ownerOf')
		assert.equal(await t_ownership.ownerOf(aliceTickets[1]), ALICE, 'check ownerOf')
		assert.equal(await t_ownership.ownerOf(bobTickets[0]), BOB, 'check ownerOf')

	})

	// test approvals
	it("should properly handle approvals", async () => {


	})

	// test transfer of tokens
	it("should properly handle token transfers", async () => {

	})

})