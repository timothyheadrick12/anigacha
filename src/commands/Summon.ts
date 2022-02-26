import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import axios from "axios";
import { getAnime } from "../requests/getAnime";

export const Summon: Command = {
  name: "summon",
  description: "Summons an anime character",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const content = await getAnime();

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
