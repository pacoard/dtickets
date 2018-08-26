import React from 'react'
import { connect } from 'react-redux'

import { setWeb3Action } from '../actions/actions'

class Web3State extends React.Component {
	constructor(props) {
		super(props);
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
						<p><strong>Current network</strong>: rinkeby (testnet), local...</p>
						<p><strong>Account</strong>: 0xAFD045FE...</p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	web3: state.web3
});

const mapDispatchToProps = (dispatch) => ({
	setWeb3: setWeb3Action
});

export default connect(mapStateToProps, mapDispatchToProps)(Web3State);