//A modifiable duel action button that appears repeatedly
//in duels. Each instance of this button corresponds
//to a specific duel action
//Import files: game_logic/battleLogic.ts

import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {Battle, FOCI_CHOICE} from '../game_logic/battleLogic';

export const modDuelAction = (action: FOCI_CHOICE, battle: Battle): Button => ({
  customId:
    'modDuelAction' +
    action +
    '_f_' +
    battle.leadPlayer.player.id +
    '_t_' +
    battle.oppPlayer.player.id,
  run: async (client: Client, interaction: ButtonInteraction) => {
    if (
      interaction.user.id != battle.leadPlayer.player.id &&
      interaction.user.id != battle.oppPlayer.player.id
    ) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You are not in this duel',
      });
    } else {
      battle.takeAction(interaction, players.get(interaction.user.id)!, action);
    }
  },
});
