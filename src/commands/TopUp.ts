import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "../typings/Command";
import { players } from "../globals";
import Player from "../models/Players";

export const TopUp: Command = {
  name: "topup",
  description: "Refill your husks",
  type: "CHAT_INPUT",
  ephemeral: true,
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, player));
      await interaction.followUp({
        content:
          "You are a new user and have never summoned before. Try using /summon first",
      });
    } else {
      players.get(interaction.user.id)!.currency += 1000;
      await interaction.followUp({
        content: "Refilled husks!",
      });
    }
  },
};
