import {io} from "socket.io-client";

// export const SERVER     = 'https://scrumbers-server.herokuapp.com/api/'
export const SERVER  = 'https://localhost:5555/api/'

// export const CLIENT     = 'https://scrumbers-client.herokuapp.com'
export const CLIENT     = 'https://localhost:8081'

// export const SOCKET     = io('https://scrumbers-server.herokuapp.com');
export const SOCKET     = io('https://localhost:5555/');

export let USER         = {}
export let TOKEN        = localStorage.getItem('TOKEN')