import {Client, SelectMenuInteraction} from 'discord.js';
import Character from '../models/Characters';
import {players} from '../globals';
import {SelectMenu} from '../typings/SelectMenu';
import {bots} from '../game_logic/botLogic';

export const SelectTarget: SelectMenu = {
  customId: 'selectTarget',
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    const bot = bots[parseInt(interaction.values[0])];
    if (!players.get(interaction.user.id)!.primaryCharacter) {
      await interaction.followUp({
        content: 'You need to set your primary character before hunting.',
      });
    }
    //primary Character is dead
    else if (!players.get(interaction.user.id)!.primaryCharacter?.isAlive) {
      await interaction.followUp({
        content: 'You cannot hunt with a dead character!',
      });
    } else {
    }
  },
};
