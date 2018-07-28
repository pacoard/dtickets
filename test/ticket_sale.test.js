var TicketSale = artifacts.require("./TicketSale.sol");
	
contract('TicketSale', function(accounts) {

	// accounts
	const OWNER = accounts[0]
	const ALICE = accounts[1];
	const BOBO = accounts[2];

	// constructor initial parameters
	const NAME = "Nirvana - Wrigley Field";
	const IPFS_HASH = 'ipfshash';
	const MAX_TICKETS = 50;
	const MAX_TICKETS_PER_PERSON = 8;
	const TICKET_PRICE = web3.toWei(1, "ether");


	it("should correctly manage the state of the sale", async () => {
		const ticketsale = await TicketSale.deployed();

		await bank.enroll({from: alice});
		await bank.enroll({from: bob});

		const aliceBalance = await bank.balance({from: alice});
		assert.equal(aliceBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');

		const bobBalance = await bank.balance({from: bob});
		assert.equal(bobBalance, 1000, 'enroll balance is incorrect, check balance method or constructor');

		const ownerBalance = await bank.balance({from: owner});
		assert.equal(ownerBalance, 0, 'only enrolled users should have balance, check balance method or constructor')
	});

	it("should change state variables of the contract", async () => {
		const bank = await SimpleBank.deployed();
		const deposit = web3.toBigNumber(2);

		await bank.enroll({from: alice});
		await bank.enroll({from: bob});

		await bank.deposit({from: alice, value: deposit});
		const balance = await bank.balance({from: alice});
		assert.equal(deposit.plus(1000).toString(), balance, 'deposit amount incorrect, check deposit method');

		const expectedEventResult = {accountAddress: alice.address, amount: deposit};

		const LogDepositMade = await bank.allEvents();
		const log = await new Promise(function(resolve, reject) {
				LogDepositMade.watch(function(error, log){ resolve(log);});
		});

		const logAccountAddress = log.args.accountAddress;
		const logAmount = log.args.amount;
		assert.equal(expectedEventResult.accountAddress, expectedEventResult.accountAddress, "LogDepositMade event accountAddress property not emmitted, check deposit method");
		assert.equal(expectedEventResult.amount, expectedEventResult.amount, "LogDepositMade event amount property not emmitted, check deposit method");
	});

	it("should cover normal and edge cases of buying tickets", async () => {
		const bank = await SimpleBank.deployed();
		const deposit = web3.toBigNumber(2);
		const initialAmount = 1000;

		await bank.enroll({from: alice});
		await bank.enroll({from: bob});

		await bank.deposit({from: alice, value: deposit});
		await bank.withdraw(deposit, {from: alice});

		const balance = await bank.balance({from: alice});

		assert.equal(initialAmount.toString(), balance, 'withdraw amount incorrect, check withdraw method');
	});


});