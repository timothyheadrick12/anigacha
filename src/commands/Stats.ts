//Allows players to view stats of character specified by id

import {Client, CommandInteraction, MessageEmbed} from 'discord.js';
import {OptionCommand} from '../typings/OptionCommand';
import Character from '../models/Characters';

export const Stats: OptionCommand = {
  name: 'stats',
  description: 'Set your primary character by providing its id',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'id',
      description: 'Display stats of a character specified by id',
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
        const statEmbed = new MessageEmbed()
          .setColor('#000000')
          .setTitle(
            character.name + character.rarity + character.isAlive
              ? ''
              : '**DEAD**'
          )
          .addFields(
            {name: 'POWER', value: character.power.toString()},
            {
              name: 'HP',
              value:
                character.maxHP.toString() + '/' + character.curHP.toString(),
              inline: true,
            },
            {
              name: 'ATTACK',
              value: character.attack.toString(),
              inline: true,
            },
            {
              name: 'DEFENSE',
              value: character.defense.toString(),
              inline: true,
            },
            {name: 'SPEED', value: character.spd.toString(), inline: true},
            {name: 'AVO', value: character.avo.toString(), inline: true},
            {name: 'HIT', value: character.hit.toString(), inline: true},
            {name: 'CRIT', value: character.crit.toString(), inline: true}
          )
          .setImage(character.image);
        await interaction.followUp({
          ephemeral: true,
          embeds: [statEmbed],
        });
      } else {
        await interaction.followUp({
          ephemeral: true,
          content: "You don't own that character",
        });
      }
    } catch (error) {
      //Typically this will not run, but just in case since the exact
      //output of Character.findByPk is unpredictable
      console.log(error);
      await interaction.followUp({
        ephemeral: true,
        content:
          'You must provide an id of a character you own. Use /inventory to check',
      });
    }
  },
};
