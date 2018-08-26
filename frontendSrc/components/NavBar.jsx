import React from 'react'

class NavBar extends React.Component {
	render() {
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">
				<div className="navbar-header">
					<a className="navbar-brand" href="#">ConsenSys Academy Final Project: Decentralized Marketplace of tickets</a>
				</div>
				<ul className="nav navbar-nav nav-tabs">
					<li><a href="/">Refresh data</a></li>
					</ul>
					<ul className="nav navbar-nav navbar-right">
					<li><a href="https://github.com/pacoard/dtickets">Github</a></li>
				</ul>
				</div>
			</nav>
		);
	}
}

export default NavBar;