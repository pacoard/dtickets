import React from 'react'
import { connect } from 'react-redux'

class Search extends React.Component {
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
									<input className="form-control" type="search" value="Enter contract address" id="example-search-input"/>
								</div>
							</div>
							<p><strong>Loading...</strong></p>
					</div>
				</div>
			</div>
		);
	}
}

export default Search