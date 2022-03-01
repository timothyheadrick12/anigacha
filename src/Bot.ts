import {Client} from 'discord.js'
import * as dotenv from 'dotenv'
import interactionCreate from './listeners/interactionCreate'
import ready from './listeners/ready'
import {updateTop100Popularity, top100Popularity} from './Vars'

dotenv.config()

const token = process.env.BOT_TOKEN

console.log('Bot is starting...')

const client = new Client({
  intents: [],
})

ready(client)
interactionCreate(client)
updateTop100Popularity().then(() =>
  console.log('Got 100th character popularity: ' + top100Popularity.toString())
)

client.login(token)
