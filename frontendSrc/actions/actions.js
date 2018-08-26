export function setWeb3Action(web3) {
	return {
		type: 'SET_WEB3',
		web3: web3
	};
}

export function setTicketContractAction(ticketContract) {
	return {
		type: 'SET_TICKET_CONTRACT',
		ticketContract: ticketContract
	}
}