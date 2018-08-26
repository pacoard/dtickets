//https://themify.me/themify-icons
export const SIDE_ELEMENTS = [
	{name: "Dashboard", 	link: "#", icon: "pe-7s-home", 		selected: true},
	{name: "Sensors", 		link: "#", icon: "pe-7s-timer", 	selected: false},
	{name: "Actuators", 	link: "#", icon: "pe-7s-light", 	selected: false},
	{name: "Add Device", 	link: "#", icon: "pe-7s-plus", 	 	selected: false},
	{name: "Delete Device", link: "#", icon: "pe-7s-trash", 	selected: false},
];

//export const REST_DNS = "t_BLOCKCHAIN_DNS:3000";

export const REST_DNS = "ec2-18-216-164-162.us-east-2.compute.amazonaws.com:3000";

export const REST_SERVER_API = "http://"+REST_DNS+"/api";

export const DEVICE_OWNER_NAMESPACE = "resource:diot.biznet.DeviceOwner#";

export const DEFAULT_USER = "pacoard@gmail.com";