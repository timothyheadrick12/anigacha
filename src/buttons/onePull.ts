import { ButtonInteraction, Client, MessageEmbed } from "discord.js";
import getCharacter from "../requests/getCharacter";
import { Button } from "../typings/Button";
import { players } from "../globals";
import { createCharacter } from "../game_logic/characterLogic";

export const onePull: Button = {
  customId: "onePull",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const characterData = await getCharacter();
    const characterEmbed = new MessageEmbed()
      .setTitle(characterData.name + " from " + characterData.anime)
      .setImage(characterData.image)
      .setDescription(
        characterData.description && characterData.description.length < 4096
          ? characterData.description
          : ""
      )
      .addField("Rarity", characterData.rarity);

    await interaction.followUp({
      embeds: [characterEmbed],
    });

    players.get(interaction.user.id)!.currency -= 100;
    players.get(interaction.user.id)!.save();

    createCharacter(players.get(interaction.user.id)!, characterData);
  },
};
