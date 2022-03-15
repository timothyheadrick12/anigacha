//Provides the player with the summon buttons

import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import {Command} from '../typings/Command';
import {players} from '../globals';
import Player from '../models/Players';

export const Summon: Command = {
  name: 'summon',
  description: 'Summons an anime character',
  type: 'CHAT_INPUT',
  ephemeral: true,
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('onePull')
        .setLabel('1x Summon')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('tenPull')
        .setLabel('10x Summon')
        .setStyle('PRIMARY')
    );
    //if new player, create player
    if (!players.has(interaction.user.id)) {
      await Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, player));
    }
    await interaction.followUp({
      content:
        '**Select a button to summon**\nHusks: ' +
        players.get(interaction.user.id)?.currency,
      components: [buttonRow],
    });

    //Should delete message after 14 minutes to avoid crashing due to
    //old interactions
    setTimeout(
      () => interaction.editReply({content: 'Timed out...', components: []}),
      14 * 60 * 1000
    );
  },
};
