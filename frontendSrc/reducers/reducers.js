import { combineReducers } from 'redux';
import { INITIAL_STATE } from '../constants/constants';


function accountReducer(state = INITIAL_STATE, action) {
	switch(action.type) {
		case 'SET_ACCOUNT':
			console.log('(action) SET_ACCOUNT');
			let newstate = state;
			newstate.account = action.account;
			return newstate;
			break;
		default: return state;
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
		default: return state;
	}
}

const reducers = combineReducers(
	{
		ticketContract: ticketContractReducer,
		account: accountReducer
	}
);

export default reducers;