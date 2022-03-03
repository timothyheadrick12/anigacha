import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { Command } from "../Command";
import getCharacter from "../requests/getCharacter";
import Character from "../models/Characters";

export const Summon: Command = {
  name: "summon",
  description: "Summons an anime character",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const character = await getCharacter();
    const characterEmbed = new MessageEmbed()
      .setTitle(character.name.full + " from " + character.anime)
      .setImage(character.image.medium)
      .setDescription(
        character.description && character.description.length < 4096
          ? character.description
          : ""
      )
      .addField("Rarity", character.rarity);

    Character.create({
      id: character.id,
      name: character.name.full,
      anime: character.anime,
      popularity: character.favourites,
      rarity: character.rarity,
    });

    await interaction.followUp({
      ephemeral: false,
      embeds: [characterEmbed],
    });
  },
};
