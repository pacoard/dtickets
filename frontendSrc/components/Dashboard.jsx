import React from 'react'
import { connect } from 'react-redux'

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
	}
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
										hey
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

const mapStateToProps = (state) => ({
	ticketContract: state.ticketContract
});

export default connect(mapStateToProps)(Dashboard);