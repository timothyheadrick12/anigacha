//Entry file of program. Starts bot, registers listeners,
//updatesPopularities of characters to determine summons power,
//pulls all the players out of the database into memory
//(This could be changed for a large scale distribution, but
//for now, it is nice for responsiveness), and fills the summonBuffer
//with 75 characters. This also acts as the long-term size
//of the summonBuffer

import {Client} from 'discord.js';
import * as dotenv from 'dotenv';
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';
import {getPlayers, updatePopularity} from './globals';
import './dbObjects';
import {fillBuffer} from './game_logic/summonLogic';

dotenv.config();

const token = process.env.BOT_TOKEN;

console.log('Bot is starting...');

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);
updatePopularity().then(() => console.log('Got popularities'));
getPlayers().then(() => console.log('Got players'));
fillBuffer(75).then(() => console.log('Filled Buffer'));

client.login(token);
