import React from 'react'
import { connect } from 'react-redux'

import { setTicketContractAction } from '../actions/actions'

import getWeb3 from '../utils/getWeb3'

class Search extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.log('<Search /> componentDidMount()');

		/*getWeb3.then(results => {
			this.setState({web3: results.web3})
			// Instantiate contract once web3 provided.
			//this.instantiateContract()
		}).catch(() => {
			console.log('Error finding web3.')
		});*/
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
	ticketContract: state.ticketContract
});

const mapDispatchToProps = (dispatch) => ({
	setTicketContract: setTicketContractAction
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);