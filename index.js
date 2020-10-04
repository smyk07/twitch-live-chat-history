"use strict";
const chalk = require('chalk');
const tmi = require('tmi.js');
const Datastore = require('nedb');

// add some security in case of there is no twitch channels as argument
if (!process.argv[2]) {
	console.error(chalk.redBright("You need to add a Twitch channel name as first argument."));
	console.info(chalk.yellowBright("eg: npm start TWITCH_CHANNEL_NAME_1 TWITCH_CHANNEL_NAME_2"));
	console.info(chalk.yellowBright("\n->  Check README.md for more informations!"));
	process.exit(0);
}

// get twitch channels from arguments
const twitchChannels = process.argv.slice(2);

// load databases
const database = new Datastore('chats.db'); 
const dropsDb = new Datastore('drops.db');
database.loadDatabase();
dropsDb.loadDatabase(); 

// instanciate client to listen twitch channel
const client = new tmi.Client({
	connection: {
		secure: true,
		reconnect: true
	},
	channels: twitchChannels
});

// connect client
client.connect();

console.info(chalk.greenBright("App start successfully, you will see twitch chats soon..."));

client.on('message', (channel, userState, message, self) => {
	// Don't listen to own messages
	if(self) return;

	const { 'display-name': username, color, mod } = userState;

	let output = `${channel} | ${mod && '[MOD]'}${username}: ${message}`;

	if(color) output = chalk.hex(color)(output);
	else output = chalk.cyanBright(output)

	console.log(output);

	// database.insert({socket_id: socket.id, time: socket.handshake.time}); 
	database.insert({username, message: message, channel});

	if (message === '!drop me') {
		console.log(`${username} just dropped!`);
		dropsDb.insert({username, channel});
	}
});