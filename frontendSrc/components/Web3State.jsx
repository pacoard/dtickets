import React from 'react'
import { connect } from 'react-redux'

class Web3State extends React.Component {
	render() {
	    let date = new Date().getFullYear();
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

export default Web3State