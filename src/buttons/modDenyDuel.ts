//A modifiable duel deny button that only the challenged
//player can interact with.
//Important files: commands/Duel.ts

import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {Buttons} from '../Buttons';

export const createModDenyDuel = (
  from: string,
  to: string,
  buttonsIndex: number
): Button => ({
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
      Buttons.splice(buttonsIndex, 1); //remove this button from the Buttons list
    }
  },
});
