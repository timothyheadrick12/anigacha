//Allows players to set their primary character based on id

import {Client, CommandInteraction} from 'discord.js';
import {OptionCommand} from '../typings/OptionCommand';
import Character from '../models/Characters';
import {players} from '../globals';

export const SetPrimary: OptionCommand = {
  name: 'setprimary',
  description: 'Set your primary character by providing its id',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'id',
      description: 'id of that character you want to set as your primary',
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
        if (character.isAlive) {
          players.get(interaction.user.id)!.primaryCharacter = character;
          players
            .get(interaction.user.id)!
            .setPrimaryCharacter(character)
            .then(() => players.get(interaction.user.id)!.save());
          await interaction.followUp({
            ephemeral: true,
            content:
              'Set primary character to ' + character.name + character.rarity,
          });
        } else {
          await interaction.followUp({
            ephemeral: true,
            content:
              'You cannot set your primary character to a dead character',
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
