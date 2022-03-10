//****************************DEPRECATED************************/

import {
  BaseCommandInteraction,
  Client,
  Message,
  MessageEmbed,
} from 'discord.js';
import {Command} from '../typings/Command';
import getTopCharacter from '../requests/getTopCharacter';

export const TopCharacter: Command = {
  name: 'topcharacter',
  description: 'Summons the top anime character',
  type: 'CHAT_INPUT',
  ephemeral: true,
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const character = await getTopCharacter();
    const characterEmbed = new MessageEmbed()
      .setTitle(character.name.full)
      .setImage(character.image.medium)
      .setDescription(character.description)
      .addField('Favorites:', character.favourites.toString(), true);

    await interaction.followUp({
      ephemeral: false,
      embeds: [characterEmbed],
    });
  },
};
