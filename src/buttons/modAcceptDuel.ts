//A modifiable duel accept button that only the challenged
//player can interact with.
//Important files: commands/Duel.ts

import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {Battle} from '../game_logic/battleLogic';
import {Buttons} from '../Buttons';

export const createModAcceptDuel = (
  from: string,
  to: string,
  buttonsIndex: number
): Button => ({
  customId: 'modAcceptDuel_f_' + from + '_t_' + to,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const challengerStr = interaction.customId.match(/(?<=_f_).+(?=_t_)/g)![0];
    const opponentStr = interaction.customId.match(/(?<=_t_).+/g)![0];
    //Player checks
    if (interaction.user.id != opponentStr) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You are not the challenged player',
      });
    } else if (!players.get(opponentStr)) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You have never summoned before, try /summon first.',
      });
    } else if (!players.get(opponentStr)!.primaryCharacter) {
      await interaction.followUp({
        ephemeral: true,
        content:
          'You need to set a primary character before accepting this duel.',
      });
    } else if (players.get(opponentStr)!.inDuel) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You cannot duel two people at once!',
      });
    } else if (players.get(challengerStr)!.inDuel) {
      await interaction.followUp({
        ephemeral: true,
        content: 'Your challenger is in another duel. They must finish first!',
      });
    }
    //If valid accept
    else {
      await interaction.editReply({
        content: 'The duel was accepted! Starting now...',
        components: [],
      });
      Buttons.splice(buttonsIndex, 1); //remove this button from the Buttons list
      const battle = new Battle(
        players.get(challengerStr)!,
        players.get(opponentStr)!
      );
      battle.start(interaction);
    }
  },
});
