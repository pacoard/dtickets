import React from 'react'

import NavBar from './NavBar'
import Web3State from './Web3State'
import Dashboard from './Dashboard'
import Search from './Search'

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
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
	}
}



export default App;
