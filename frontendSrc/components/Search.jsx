import React from 'react'
import { connect } from 'react-redux'

import { setAccountAction, setTicketContractAction } from '../actions/actions'

import getEth from '../utils/getEth'


import * as TicketContractData from '../utils/TicketOwnership.json'

class Search extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			eth: null,
			ticketContract: '',
			searchState: 'No contract'
		}
		this.handleChange = this.handleChange.bind(this)
		this.enterContract = this.enterContract.bind(this)
	}

	async componentDidMount() {
		console.log('<Search /> componentDidMount()');
		this.setState({
			eth: (await getEth).eth
		})
	}
	handleChange(e) {
		this.setState({ticketContract: e.target.value});
	}
	enterContract(e) {
		if(e.keyCode == 13) { //Enter key was pressed
			this.setState({searchState: 'Loading...'})
			const TicketContract = this.state.eth.contract(TicketContractData.abi, TicketContractData.deployedBytecode);
			const ticketContract = TicketContract.at(this.state.ticketContract)
			
			ticketContract.ipfsMetaData().then((result) => {
				this.setState({searchState: 'Ticket Sale contract found!'})
				//Notify the rest of the application that a valid contract was entered
				this.props.setTicketContract(this.state.ticketContract)
				this.props.notifyDashboard(this.state.ticketContract)
			}).catch((err) => {
				this.setState({searchState: 'No valid contract found.'})
			})
		} 
	}
	render() {
		return (
			<div className="row">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title"><strong>Tickets Contract</strong></h3>
					</div>
					<div className="panel-body">
							<div className="form-group row">
								<div className="col-10">
									<input 	value={this.state.ticketContract} 
											onChange={this.handleChange}
											onKeyDown={this.enterContract} 
											className="form-control" type="search" placeholder="Enter ticket contract address" id="example-search-input"/>
								</div>
							</div>
							<p><strong>{this.state.searchState}</strong></p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	ticketContract: state.ticketContractReducer,
	account: state.accountReducer,
});

const mapDispatchToProps = {
	setAccount: setAccountAction,
	setTicketContract: setTicketContractAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);