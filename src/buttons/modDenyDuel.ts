import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {createCharacter} from '../game_logic/characterLogic';
import {summon} from '../game_logic/summonLogic';

export const createModDenyDuel = (from: string, to: string): Button => ({
  customId: 'modDenyDuel_f_' + from + '_t_' + to,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const opponentStr = interaction.customId.match(/(?<=_t_).+/g)![0];
    if (interaction.user.id != opponentStr) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You are not the challenged player',
      });
    } else {
      await interaction.editReply({
        content: interaction.user.username + ' has declined to duel!',
        components: [],
      });
    }
  },
});
