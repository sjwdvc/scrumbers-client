import {io} from "socket.io-client";

let host;
if (process.env.NODE_ENV && process.env.NODE_ENV == 'development')
    host = { server: 'https://localhost:5555', client: 'https://localhost:8080' };
else
    host = { server: 'https://scrumbers-server.herokuapp.com', client: 'https://scrumbers-client.herokuapp.com' };
export const SERVER  = host.server + '/api/'
//
//export const CLIENT     = 'https://scrumbers-client.herokuapp.com'
export const CLIENT     = host.client

//export const SOCKET     = io('https://scrumbers-server.herokuapp.com');
export const SOCKET     = io(host.server);

export let USER         = {}
export let TOKEN        = localStorage.getItem('TOKEN')