import {
  ChatInputApplicationCommandData,
  Client,
  CommandInteraction,
} from 'discord.js';

export interface OptionCommand extends ChatInputApplicationCommandData {
  ephemeral: boolean;
  run: (client: Client, interaction: CommandInteraction) => void;
}
