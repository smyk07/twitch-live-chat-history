"use strict";
const chalk = require('chalk');
const tmi = require('tmi.js');
const Datastore = require('nedb');
const path = require('path');

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { findIcon } = require('./helpers');
const emoticons = require('./data/twitch-emoticons');

app.use(express.static(path.join(__dirname, "web")));
app.set("views", path.join(__dirname, "web"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
	res.render("index.html");
});

let twitchChannels = [];

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
	}
});

// Clears Console
function clearConsoleAndScrollbackBuffer() {
	process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");console.clear();
	}

console.info(chalk.greenBright("Fetching messages..."));
let fetched = false;

// listen messages from twitch channels
client.on('message', (channel, tags, message, self) => {
	// "#twitchChannel | Alca: Hello, World!"
	if(!fetched){clearConsoleAndScrollbackBuffer();console.info('---------------'+'Twitch Live Chat'+'---------------');fetched=true;}
	console.log(chalk.cyanBright(`${channel} | ${tags['display-name']} > ${message}`));

	// database.insert({socket_id: socket.id, time: socket.handshake.time}); 
	database.insert({
		channel,
		message,
		username: tags['display-name']
	}); 

	if (message === '!drop me') {
		console.log(`${tags['display-name']} just dropped!`); 
		dropsDb.insert({
			channel,
			username: tags['display-name']
		}); 
	}
});

io.on('connection', socket => {
	// connect client
	client.connect();

	socket.emit('channels', twitchChannels);

	client.on('message', (channel, tags, message, self) => {
		if(self) return;
		socket.emit('chat', {channel, tags, message: findIcon(message, emoticons)});
	})

	socket.on('addChat', newChannel => {
		twitchChannels.push(newChannel);
		client.join(newChannel);
		socket.emit('channels', twitchChannels);
	})

	socket.on('disconnectChannel', channelToDisconnect => {
		twitchChannels = twitchChannels.filter(channel => channel !== channelToDisconnect);
		client.part(channelToDisconnect.replace('#', ''))
	})
});

server.listen(8080);
