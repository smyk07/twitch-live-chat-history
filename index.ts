import { Client } from "tmi.js";
import * as chalk from "chalk";
import Datastore from "nedb";

const twitchChannel = process.argv.slice(2); 
const { cyanBright } = require('chalk');

const database = new Datastore('chats.db'); 
database.loadDatabase();

const dropsDb = new Datastore('drops.db'); 
dropsDb.loadDatabase(); 

const client = Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: twitchChannel
	// channels: [ 'codinggarden' ]
});

client.connect();

client.on('message', (_, tags, message) => {
	// "Alca: Hello, World!"

	console.log(chalk.cyanBright(`${tags['display-name']}: ${message}`));

	// database.insert({socket_id: socket.id, time: socket.handshake.time}); 
	database.insert({username: tags['display-name'], message: message, channel: twitchChannel}); 

	if (message === '!drop me') {
		console.log(`${tags['display-name']} just dropped!`); 
		dropsDb.insert({username: tags['display-name'], channel: twitchChannel}); 
	}
});