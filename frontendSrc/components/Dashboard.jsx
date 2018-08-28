import React from 'react'
import { connect } from 'react-redux'

import getEth from '../utils/getEth'
import * as TicketContractData from '../utils/TicketOwnership.json'

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			thereIsContract: false,
			contract: null,
			userAddress: '',
			name: '',
			ticketPrice: '',
			maxTicketsPerPerson: '',
			soldTickets: '',
			ipfshash: '',
			maxTickets: '',
			yourTickets: '',
			raisedEther: '',

			ticketsToBuy: 0,
			setTicketPrice: 0,
			addMoreTickets: 0,
			setIpfsMetaData: '',
		}
		this.buyTicket = this.buyTicket.bind(this)
		this.ticketsToBuyChange = this.ticketsToBuyChange.bind(this)
		
		this.startSale = this.startSale.bind(this)
		this.stopSale = this.stopSale.bind(this)

		this.setTicketPrice = this.setTicketPrice.bind(this)
		this.setTicketPriceChange = this.setTicketPriceChange.bind(this)

		this.addMoreTickets = this.addMoreTickets.bind(this)
		this.addMoreTicketsChange = this.addMoreTicketsChange.bind(this)

		this.setIpfsMetaData = this.setIpfsMetaData.bind(this)
		this.setIpfsMetaDataChange = this.setIpfsMetaDataChange.bind(this)
	}
	async buyTicket() {
		await this.state.contract.buyTicket(this.state.ticketsToBuy, {
			from: this.state.userAddress, 
			value: this.state.ticketsToBuy*this.state.ticketPrice*1e18
		})
		//console.log( this.state.ticketsToBuy*this.state.ticketPrice*1e18)
		this.forceUpdate()
	}
	ticketsToBuyChange(e) {
		this.setState({ticketsToBuy: e.target.value});
	} 

	async startSale() {
		await this.state.contract.startSale({from: this.state.userAddress})
		this.forceUpdate()
	}
	async stopSale() {
		await this.state.contract.stopSale({from: this.state.userAddress})
		this.forceUpdate()
	}
	

	async setTicketPrice() {
		await this.state.contract.setTicketPrice(this.state.setTicketPrice*1e18, {from: this.state.userAddress})
		this.forceUpdate()
	}
	setTicketPriceChange(e) {
		this.setState({setTicketPrice: e.target.value});
	} 

	async addMoreTickets() {
		await this.state.contract.addMoreTickets(this.state.addMoreTickets, {from: this.state.userAddress})
		this.forceUpdate()
	}
	addMoreTicketsChange(e) {
		this.setState({addMoreTickets: e.target.value});
	} 

	async setIpfsMetaData() {
		await this.state.contract.setIpfsMetaData(this.state.setIpfsMetaData, {from: this.state.userAddress})
		this.forceUpdate()
	}
	setIpfsMetaDataChange(e) {
		this.setState({setIpfsMetaData: e.target.value});
	} 

	// 0x46f726295b12a5d50c39844b52a13308798685ba
	async componentWillReceiveProps(nextProps) {
		console.log('<Dashboard /> componentWillReceiveProps()')

		let ethjs = (await getEth).eth

		const TicketContract = ethjs.contract(TicketContractData.abi, TicketContractData.deployedBytecode);
		let ticketContract = TicketContract.at(nextProps.ticketContractAddress)

		console.log(ticketContract)
		
		let userAddress, name, ticketPrice, ipfshash, maxTicketsPerPerson, soldTickets, maxTickets, yourTickets, raisedEther
		
		userAddress = (await ethjs.accounts())[0]
		name = (await ticketContract.name())[0]
		ticketPrice = (await ticketContract.ticketPrice())[0]
		maxTicketsPerPerson = (await ticketContract.maxTicketsPerPerson())[0]
		soldTickets = (await ticketContract.soldTickets())[0]
		ipfshash = (await ticketContract.ipfsMetaData())[0]
		maxTickets = (await ticketContract.maxTickets())[0]
		yourTickets = (await ticketContract.balanceOf(userAddress))[0]
		raisedEther = (await ethjs.getBalance(ticketContract.address))

		this.setState({
			thereIsContract: true,
			contract: ticketContract,
			userAddress: userAddress,
			name: name,
			ticketPrice: Number(ticketPrice.toString()) / 1e18,
			maxTicketsPerPerson: maxTicketsPerPerson.toNumber(),
			soldTickets: soldTickets.toNumber(),
			ipfshash: ipfshash,
			maxTickets: maxTickets.toNumber(),
			yourTickets: yourTickets.toNumber(),
			raisedEther: Number(raisedEther.toString()) / 1e18 ,
		});
		

		this.forceUpdate()
	}


	render() {
		let saleData, actions, ipfsData
		if (this.state.thereIsContract) {
			saleData = 	<blockquote className="card-blockquote" style={{fontSize: '0.9em'}}>
							<ul className="list-group">
							<li><strong>Name</strong>: {this.state.name}</li>
							<li><strong><a href={"https://ipfs.io/ipfs/"+ this.state.ipfshash}>IPFS metadata</a></strong></li>
							<li><strong>Ticket price</strong>: {this.state.ticketPrice} ether</li>
							<li><strong>Max tickets per person</strong>: {this.state.maxTicketsPerPerson}</li>
							<li><strong>Sale</strong>: {this.state.soldTickets}/{this.state.maxTickets}</li>
							<li><strong>Raised ether</strong>: {this.state.raisedEther}</li>
							<br />
							<li><strong>You have {this.state.yourTickets} tickets</strong></li>
							</ul>
						</blockquote>
			// buyTicket, startSale, stopSale, setTicketPrice, addMoreTickets, setIpfsMetaData
			actions = 	<div className="btn-group-vertical" data-toggle="buttons">
							<div className="form-group">
								<button type="button" 
										className="btn btn-primary"
										onClick={this.buyTicket}>Buy Tickets</button>
								<input 	type="number" 
										place-holder="Number of tickets" 
										className="form-control is-valid" 
										id="inputValid"
										onChange={this.ticketsToBuyChange}/>
							</div>
							<h4><strong>Only owner actions</strong></h4>
							<div className="form-group">
							<button type="button" 
									className="btn btn-danger"
									onClick={this.startSale}>Start sale</button>
							<button type="button" 
									className="btn btn-danger"
									onClick={this.stopSale}>Stop sale</button>
							</div>
							<div className="form-group">
								<button type="button" 
										className="btn btn-danger"
										onClick={this.setTicketPrice}>Set ticket price (ether)</button>
								<input 	type="number" 
										min="0"
										step="0.01"
										place-holder="Number of tickets" 
										className="form-control is-valid" 
										id="inputValid"
										onChange={this.setTicketPriceChange}/>
							</div>
							<div className="form-group">
								<button type="button" 
										className="btn btn-danger"
										onClick={this.addMoreTickets}>Add more tickets</button>
								<input 	type="number" 
										place-holder="Number of tickets" 
										className="form-control is-valid" 
										id="inputValid"
										onChange={this.addMoreTicketsChange}/>
							</div>
							<div className="form-group">
								<button type="button" 
										className="btn btn-danger"
										onClick={this.setIpfsMetaData}>Set IPFS metadata hash</button>
								<input 	type="text" 
										place-holder="Number of tickets" 
										className="form-control is-valid" 
										id="inputValid"
										onChange={this.setIpfsMetaDataChange}/>
							</div>
						</div>

			ipfsData = '' //TODO
		}
		return (
			<div className="col-sm-8">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title"><strong>Current contract</strong></h3>
					</div>
					<br/>
					<div className="col-sm-6" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="card border-success">
								<div className="card-body">
									<h4><strong>Sale data</strong></h4>
										{saleData}
								</div>
						</div>
					</div>
					<div className="col-sm-6">
						<div className="card border-success">
							<div className="card-body">
								<blockquote className="card-blockquote" style={{fontSize: '0.9em'}}>
										{actions}
								</blockquote>
							</div>
						</div>
					</div>

					<div className="panel-body">
						<div className="col-sm-12">
							<div className="card border-success">
								<div className="card-body">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default Dashboard