import React from 'react'
import 'regenerator-runtime/runtime';

import NavBar from './NavBar'
import Web3State from './Web3State'
import Dashboard from './Dashboard'
import Search from './Search'

import getEth from '../utils/getEth'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			web3enabled: false,
			ticketContract: ''
		}
		this.notifyDashboard = this.notifyDashboard.bind(this)
	}
	async componentDidMount() {
		console.log('<App /> componentWillMount()');
		let eth
		getEth.then(results => {
			eth = results.eth
			return eth.accounts()
		}).then(accounts => {
			let nAccounts = accounts.length
			this.setState({
				web3enabled: eth.currentProvider.isConnected() && (nAccounts > 0)
			})
			console.log("Copy this object for testing: ")
			console.log(eth)
		}).catch(() => {
			console.log('Error finding web3.')
			this.setState({
				web3enabled: false
			})
		});

	}
	notifyDashboard(newContractAddress) {
		console.log('App => notifyDashboard')
		console.log(newContractAddress)
		this.setState({ticketContract: newContractAddress})
	}
	render() {
		if (this.state.web3enabled) {
			return (
				<div>
					<NavBar />
					<div className="row" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="col-sm-4" style={{paddingRight: '30px', paddingLeft: '30px'}}>
							<Web3State />
							<Search notifyDashboard={this.notifyDashboard}/>
						</div>
						<Dashboard ticketContractAddress={this.state.ticketContract}/>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<NavBar />
					<div className="row" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="alert alert-dismissible alert-danger">
						  
						  <h4><strong>Oh snap!</strong> Looks like web3 is not enabled. You must use MetaMask to connect to an Ethereum node in order to use this dApp.</h4>
						  <h4>Try realoading the page when you log in MetaMask!</h4>
						</div>
					</div>
				</div>
			);
		}
		
	}
}


export default App
