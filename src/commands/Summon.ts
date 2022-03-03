import {BaseCommandInteraction, Client, MessageEmbed} from 'discord.js';
import {Command} from '../Command';
import getCharacter from '../requests/getCharacter';
import Character from '../models/Characters';
import {players} from '../globals';
import Player from '../models/Players';
import {createCharacter} from '../game_logic/characterLogic';

export const Summon: Command = {
  name: 'summon',
  description: 'Summons an anime character',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const characterData = await getCharacter();
    const characterEmbed = new MessageEmbed()
      .setTitle(characterData.name.full + ' from ' + characterData.anime)
      .setImage(characterData.image.medium)
      .setDescription(
        characterData.description && characterData.description.length < 4096
          ? characterData.description
          : ''
      )
      .addField('Rarity', characterData.rarity);

    await interaction.followUp({
      ephemeral: false,
      embeds: [characterEmbed],
    });

    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => {
        players.set(player.id, null);
        createCharacter(player, characterData).then((character) => {
          if (character) {
            players.set(player.id, character);
            player.setPrimaryCharacter(character);
          }
        });
      });
    } else {
      Player.findByPk(interaction.user.id).then((player) => {
        if (player) {
          createCharacter(player, characterData);
        }
      });
    }
  },
};
