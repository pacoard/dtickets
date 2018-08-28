import React from 'react'
import { connect } from 'react-redux'

import getEth from '../utils/getEth'
import * as TicketContractData from '../utils/TicketOwnership.json'

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: ''
		}
		this.updateData = this.updateData.bind(this)
	}
	async componentWillReceiveProps(nextProps) {
		console.log('<Dashboard /> componentDidUpdate()')
		let eth = (await getEth).eth

		const TicketContract = eth.contract(TicketContractData.abi, TicketContractData.deployedBytecode);
		let ticketContract = TicketContract.at(nextProps.ticketContractAddress)

		this.updateData(ticketContract)
	}

	async updateData(contract) {
		console.log("Dashboard => updateData(contract)")
		let name, ticketPrice, ipfshash, maxTicketsPerPerson, soldTickets
		ipfshash = (await contract.ipfsMetaData())[0]
		console.log(ipfshash)

		this.setState({data: ipfshash});
	} // 0x2f58600d5a84031964408bb31ce6b77512ad4918

	render() {
		return (
			<div className="col-sm-8">
				<div className="panel panel-success">
					<div className="panel-heading">
						<h3 className="panel-title"><strong>EC2 Instances metrics (last 10 minutes)</strong></h3>
					</div>
					<br/>
					<div className="col-sm-12" style={{paddingRight: '30px', paddingLeft: '30px'}}>
						<div className="card border-success">
								<div className="card-body">
									<h4><strong>Frontend (3 instances)</strong></h4>
									<blockquote className="card-blockquote" style={{fontSize: '0.9em'}}>
										{this.state.data}
									</blockquote>
								</div>
						</div>
					</div>

					<div className="panel-body">
							<div className="col-sm-6">
							<div className="card border-success">
							<div className="card-body">
								<h4><strong>Backend (1 instance)</strong></h4>
								<blockquote className="card-blockquote" style={{fontSize: '0.9em'}}>
										hey
								</blockquote>
							</div>
							</div>
						</div>
						<div className="col-sm-6">
							<div className="card border-success">
							<div className="card-body">
								<h4><strong>Dashboard (1 instance)</strong></h4>
								<blockquote className="card-blockquote" style={{fontSize: '0.9em'}}>
										HEY
								</blockquote>
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