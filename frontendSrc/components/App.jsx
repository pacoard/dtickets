import React from 'react'
import { connect } from 'react-redux'
import 'regenerator-runtime/runtime';
//import Web3 from 'web3';
var web3 = require('web3')

import NavBar from './NavBar'
import Web3State from './Web3State'
import Dashboard from './Dashboard'
import Search from './Search'

import getWeb3 from '../utils/getWeb3'
import { setWeb3Action } from '../actions/actions'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			web3enabled: false,
			web3: new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
		}
	}
	componentWillMount() {
		console.log('<App /> componentWillMount()');
		/*getWeb3.then(results => {
			this.setState({web3: results.web3})
			//this.props.setWeb3Action(results.web3)
			// Instantiate contract once web3 provided.
			//this.instantiateContract()
		}).catch(() => {
			console.log('Error finding web3.')
		});*/
		if(this.state.web3) {
			this.setState({web3enabled: true})
		}

	}
	render() {
		if (this.state.web3enabled) {
			return (
				<div>
					<NavBar />
					<div className="row" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="col-sm-4" style={{paddingRight: '30px', paddingLeft: '30px'}}>
							<Web3State />
							<Search />
						</div>
						<Dashboard />
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<NavBar />
					<div className="row" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="alert alert-dismissible alert-danger">
						  <button type="button" className="close" data-dismiss="alert">&times;</button>
						  <strong>Oh snap!</strong> Looks like web3 is not enabled. Connect to an Ethereum node and try again.
						</div>
					</div>
				</div>
			);
		}
		
	}
}


// Support React+Redux
const mapStateToProps = (state) => ({
	web3: state.web3,
	ticketContract: state.ticketContract
});

const mapDispatchToProps = {
	setWeb3: setWeb3Action
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
//export default App
