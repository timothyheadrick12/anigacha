import {Client} from 'discord.js';
import * as dotenv from 'dotenv';
import interactionCreate from './listeners/interactionCreate';
import ready from './listeners/ready';
import {updatePopularity} from './globals';
import './dbObjects';

dotenv.config();

const token = process.env.BOT_TOKEN;

console.log('Bot is starting...');

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);
updatePopularity().then(() => console.log('Got popularities'));

client.login(token);
