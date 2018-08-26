import { combineReducers } from 'redux';
import { INITIAL_STATE } from '../constants/constants';


function web3Reducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case 'SET_WEB3':
			console.log('(action) SET_WEB3');
			let newstate = state;
			newstate.web3 = action.web3;
			return newstate;
			break;
		default: return state.web3;
	}
}

function ticketContractReducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case 'SET_TICKET_CONTRACT':
			console.log('(action) SET_TICKET_CONTRACT');
			let newstate = state;
			newstate.ticketContract = action.ticketContract;
			return newstate;
			break;
		default: return state.ticketContract;
	}
}

const reducers = combineReducers(
	{
		ticketContract: ticketContractReducer,
		web3: web3Reducer
	}
);

export default reducers;