//Allows players to heal a character specified by id for 100 husks

import {Client, CommandInteraction} from 'discord.js';
import {OptionCommand} from '../typings/OptionCommand';
import Character from '../models/Characters';
import {players} from '../globals';

export const Heal: OptionCommand = {
  name: 'heal',
  description: 'Set your primary character by providing its id',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'id',
      description: 'Costs 100 husks to heal character specified by id',
      type: 4, //type int
      required: true,
    },
  ],
  ephemeral: true,
  run: async (client: Client, interaction: CommandInteraction) => {
    try {
      const character = await Character.findByPk(
        interaction.options.getInteger('id', true)
      );
      if (character?.owner_id == interaction.user.id) {
        //if in duel
        if (players.get(interaction.user.id)!.inDuel) {
          await interaction.followUp({
            ephemeral: true,
            content: 'You cannot heal during a duel',
          });
        } else if (!character.isAlive) {
          await interaction.followUp({
            ephemeral: true,
            content: 'You cannot heal a dead character',
          });
        } else if (players.get(interaction.user.id)!.currency < 100) {
          await interaction.followUp({
            ephemeral: true,
            content: 'You need 100 husks to perform heal',
          });
        } else {
          character.curHP = character.maxHP; //heal
          character.save();
          players.get(interaction.user.id)!.currency -= 100; //charge
          players.get(interaction.user.id)!.save();
          await interaction.followUp({
            ephemeral: true,
            content:
              'Healed ' +
              character.name +
              character.rarity +
              '       HP:' +
              character.maxHP +
              '/' +
              character.curHP,
          });
        }
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: "You don't own that character",
        });
      }
    } catch (error) {
      //Typically this will not run, but just in case since the exact
      //output of Character.findByPk is unpredictable
      await interaction.followUp({
        ephemeral: true,
        content:
          'You must provide an id of a character you own. Use /inventory to check',
      });
    }
  },
};
