import React from 'react'
import { connect } from 'react-redux'

import { setTicketContractAction } from '../actions/actions'

class Search extends React.Component {
	constructor(props) {
		super(props);
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
									<input className="form-control" type="search" placeholder="Enter ticket contract address" id="example-search-input"/>
								</div>
							</div>
							<p><strong>Loading...</strong></p>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	web3: state.web3,
	ticketContract: state.ticketContract
});

const mapDispatchToProps = (dispatch) => ({
	setTicketContract: setTicketContractAction
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);