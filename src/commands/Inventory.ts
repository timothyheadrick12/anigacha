import {BaseCommandInteraction, Client, MessageEmbed} from 'discord.js';
import {Command} from '../Command';
import {players} from '../globals';
import Player from '../models/Players';

interface embedField {
  name: string;
  value: string;
}

export const Inventory: Command = {
  name: 'inventory',
  description: 'Check your character inventory',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, null));
      await interaction.followUp({
        ephemeral: true,
        content:
          'You are a new user and have never summoned before. Try using /summon first',
      });
    } else {
      const player = await Player.findByPk(interaction.user.id);
      const characters = await player?.getCharacters({
        attributes: ['name', 'rarity'],
      });
      if (!characters) {
        await interaction.followUp({
          ephemeral: true,
          content: 'You have no characters. Try using /summon first',
        });
      } else {
        const fields: Array<embedField> = [];
        characters?.forEach((character) => {
          fields.push({
            name: character.name,
            value: character.rarity,
          });
        });
        const primaryCharacter = players.get(interaction.user.id);
        const inventoryEmbed = new MessageEmbed()
          .setTitle(
            primaryCharacter
              ? primaryCharacter.name + ' ' + primaryCharacter.rarity
              : ''
          )
          .addFields(...fields);
        await interaction.followUp({
          ephemeral: true,
          embeds: [inventoryEmbed],
        });
      }
    }
  },
};
