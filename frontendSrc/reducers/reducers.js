import { combineReducers } from 'redux';
import { SIDE_ELEMENTS, DEFAULT_USER } from '../constants/constants';

function sideElementsReducer(state = SIDE_ELEMENTS, action) {
	switch(action.type) {
		case 'SELECT_SIDE_ELEMENT':
			console.log('(action) SELECT_SIDE_ELEMENT')
			let newstate = state;
			newstate.forEach(function (element) {
				if (element.name == action.sideElementName) {
					element.selected = true;
					console.log("Selected: "+element.name);
				} else {
					element.selected = false
				}
			})
			return newstate;
			break;
		default: return state;
	}
}

function userReducer(state = DEFAULT_USER, action) {
	switch(action.type) {
		case 'SWITCH_USER':
			console.log('(action) SWITCH_USER')
			let newstate = state;
			/*newstate.forEach(function (element) {
				if (element.name == action.sideElementName) {
					element.selected = true;
					console.log("Selected: "+element.name);
				} else {
					element.selected = false
				}
			})*/
			return newstate;
			break;
		default: return state;
	}
}

function notificationReducer(state = '', action) {
		switch(action.type) {
		case 'NOTIFICATION':
			console.log('(action) NOTIFICATION')
			let newstate = state;
			/*newstate.forEach(function (element) {
				if (element.name == action.sideElementName) {
					element.selected = true;
					console.log("Selected: "+element.name);
				} else {
					element.selected = false
				}
			})*/
			return newstate;
			break;
		default: return state;
	}
}

const reducers = combineReducers(
	{
		sideElements: sideElementsReducer,
		userEmail: userReducer,
		notification: notificationReducer,
	});

export default reducers;