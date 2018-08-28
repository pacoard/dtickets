import React from 'react'
import { connect } from 'react-redux'

import { setAccountAction, setTicketContractAction } from '../actions/actions'

import getEth from '../utils/getEth'

class Web3State extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			eth: null,
			enabled: false,
			network: 'none',
			account: 'none',
		}
		this.updateData = this.updateData.bind(this)
	}
	async componentDidMount() {
		console.log('<Web3State /> componentDidMount()')

		let getNetwork = (n) => {
			switch (n) {
			    case "1":
			      return 'Mainnet'
			      break
			    case "2":
			      return 'Morden'
			      break
			    case "3":
			      return 'Ropsten'
			      break
			    case "4":
			      return 'Rinkeby'
			      break
			    default:
			      return 'Unknown network'
			      break
			  }
		}
		//let eth, enabled, network, account

		let eth = (await getEth).eth

		if (eth != null) {
			this.setState({
				eth: eth,
				enabled: eth.currentProvider.isConnected(),
				network: getNetwork(await eth.net_version()),
				account: (await eth.accounts())[0],
			})
			this.props.setAccount(this.state.account)
		} else {
			console.log('Error finding web3.')
			this.setState({
				eth: null,
				enabled: false,
				network: 'none',
				account: 'none',
			})
		}

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
		let t_enabled = (this.state.enabled) ? <p style={{color:'#84FF33', fontWeight:'bold'}}>Enabled</p> : <p style={{color:'red', fontWeight:'bold'}}>Disabled</p>;
		return (
			<div className="row">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title"><strong>Web3</strong></h3>
					</div>
					<div className="panel-body">
						{t_enabled}
						<p><strong>Current network</strong>: {this.state.network}</p>
						<p><strong>Account</strong>:</p>
						<p> {this.state.account.substring(0, 30).replace(/\w{3}$/gi, '...')}</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Web3State);