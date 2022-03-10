//***********DEPRECATED*************************************************/

import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  SelectMenuInteraction,
} from 'discord.js';
import Character from '../models/Characters';
import {players} from '../globals';
import {SelectMenu} from '../typings/SelectMenu';

export const SelectPrimaryCharacter: SelectMenu = {
  customId: 'selectPrimaryCharacter',
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      Character.findByPk(parseInt(interaction.values[0])).then((character) => {
        players.get(interaction.user.id)!.primaryCharacter = character!;
        players.get(interaction.user.id)!.setPrimaryCharacter(character!);
      });
    } catch (error) {
      console.log('Error setting primary character');
    }
    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('unused')
        .setLabel('Primary Character Selected')
        .setStyle('PRIMARY')
        .setDisabled()
    );
    await interaction.editReply({
      components: [buttonRow],
    });
  },
};
