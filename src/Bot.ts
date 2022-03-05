import { Client } from "discord.js";
import * as dotenv from "dotenv";
import interactionCreate from "./listeners/interactionCreate";
import ready from "./listeners/ready";
import { getPlayers, updatePopularity } from "./globals";
import "./dbObjects";
import { fillBuffer } from "./game_logic/summonLogic";

dotenv.config();

const token = process.env.BOT_TOKEN;

console.log("Bot is starting...");

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);
updatePopularity().then(() => console.log("Got popularities"));
getPlayers().then(() => console.log("Got players"));
fillBuffer(75).then(() => console.log("Filled Buffer"));

client.login(token);
