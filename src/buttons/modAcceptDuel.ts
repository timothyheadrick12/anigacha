import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {createCharacter} from '../game_logic/characterLogic';
import {summon} from '../game_logic/summonLogic';
import {Battle} from '../game_logic/battleLogic';

export const createModAcceptDuel = (from: string, to: string): Button => ({
  customId: 'modAcceptDuel_f_' + from + '_t_' + to,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const challengerStr = interaction.customId.match(/(?<=_f_).+(?=_t_)/g)![0];
    const opponentStr = interaction.customId.match(/(?<=_t_).+/g)![0];
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
    } else if (!players.get(opponentStr)!.inDuel) {
      await interaction.followUp({
        ephemeral: true,
        content: 'You cannot duel two people at once!',
      });
    } else if (!players.get(challengerStr)!.inDuel) {
      await interaction.followUp({
        ephemeral: true,
        content: 'Your challenger is in another duel. They must finish first!',
      });
    } else {
      await interaction.editReply({
        content: 'The duel was accepted! Starting now...',
        components: [],
      });
      const battle = new Battle(
        players.get(challengerStr)!,
        players.get(opponentStr)!
      );
      battle.start(interaction);
    }
  },
});
