import {Client, SelectMenuInteraction} from 'discord.js';
import Character from '../models/Characters';
import {players} from '../globals';
import {SelectMenu} from '../typings/SelectMenu';
import {bots} from '../game_logic/botLogic';

export const SelectTarget: SelectMenu = {
  customId: 'selectTarget',
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    const bot = bots[parseInt(interaction.values[0])];
  },
};
