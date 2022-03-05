import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../typings/Command";
import { players } from "../globals";
import Player from "../models/Players";

interface embedField {
  name: string;
  value: string;
}

export const Inventory: Command = {
  name: "inventory",
  description: "Check your character inventory",
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
      const player = players.get(interaction.user.id)!;
      const characters = await player.getCharacters({
        attributes: ["name", "rarity", "id"],
        order: [["power", "DESC"]],
      });
      if (!characters) {
        await interaction.followUp({
          content: "You have no characters. Try using /summon first",
        });
      } else {
        var messages = [
          player.primaryCharacter
            ? "Primary: **" +
              player.primaryCharacter.name +
              player.primaryCharacter.rarity +
              "** \n\n"
            : "",
        ];
        var index = 0;
        characters?.forEach((character) => {
          if (messages[index].length < 1900)
            messages[index] +=
              "[" +
              character.id.toString() +
              "]" +
              character.name +
              character.rarity +
              "     ";
          else {
            messages.push("");
            index++;
          }
        });
        for (var i = 0; i < messages.length; i++) {
          await interaction.followUp({
            ephemeral: true,
            content: messages[i],
          });
        }
      }
    }
  },
};
