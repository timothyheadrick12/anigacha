import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
} from 'discord.js';

export interface Command extends ChatInputApplicationCommandData {
  ephemeral: boolean;
  run: (client: Client, interaction: CommandInteraction) => void;
}
