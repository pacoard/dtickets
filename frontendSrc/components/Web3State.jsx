import React from 'react'
import { connect } from 'react-redux'
//import Web3 from 'web3';
//var web3 = require('web3')
import { setTicketContractAction } from '../actions/actions'


import getWeb3 from '../utils/getWeb3'

class Web3State extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			web3: null,
			enabled: false,
			network: 'none',
			account: 'none',
		}
		this.updateData = this.updateData.bind(this)
	}
	componentDidMount() {
		console.log('<Web3State /> componentDidMount()')

		getWeb3.then(results => {
			this.setState({
				web3: null,
				enabled: true,
				network: 'none',
				account: 'none',
				})
			let eth = results.web3
			eth.accounts((err, result) => {
			  console.log(result)
			});
		}).catch(() => {
			console.log('Error finding web3.')
		});
	}
	updateData() {
		console.log('<Web3State /> updateData()')
		/*let accounts = await web3.eth.accounts
		this.setState({
			enabled: true,
			network: 'a network',
			account: accounts[0],
		})*/
	}
	render() {
		return (
			<div className="row">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title"><strong>Web3</strong></h3>
					</div>
					<div className="panel-body">
						<p><strong>ID: </strong>= job.id %> => <strong>Status: </strong>if (job.status == 1) { <a style={{color:'green'}}>Done</a>} else if (job.status == 0) {<a style={{color:'red'}}>Pending</a> } %></p>
						<p><strong>Enabled</strong>: Disabled</p>
						<p><strong>Current network</strong>: {this.state.network}</p>
						<p><strong>Account</strong>: {this.state.account}</p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	ticketContract: state.ticketContract
});

const mapDispatchToProps = {
	setTicketContract: setTicketContractAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Web3State);