import {
  BaseCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
  ephemeral: boolean;
  run: (client: Client, interaction: BaseCommandInteraction) => void;
}
