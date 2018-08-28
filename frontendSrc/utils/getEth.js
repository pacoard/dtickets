//import Web3 from 'web3'

import Eth from 'ethjs'


let getEth = new Promise(function(resolve, reject) {
	// Wait for loading completion to avoid race conditions with web3 injection timing.
	window.addEventListener('load', function() {
		var results
		var web3 = window.web3

		// Checking if Web3 has been injected by the browser (Mist/MetaMask)
		if (typeof web3 !== 'undefined') {

			results = {
				eth: new Eth(web3.currentProvider)
			}

			console.log('Injected web3 detected.');

			resolve(results)
		} else {
			// Fallback to localhost if no web3 injection. We've configured this to
			// use the development console's port by default.
			var provider = new Eth.providers.HttpProvider('http://127.0.0.1:9545')

			results = {
				eth: new Eth(provider)
			}

			console.log('No web3 instance injected, using Local web3.');
ç
			resolve(results)
		}
	})
})

export default getEth

