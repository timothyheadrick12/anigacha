//Perform a singular summon if the player has enough husks.

import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {createCharacter} from '../game_logic/characterLogic';
import {summon} from '../game_logic/summonLogic';

export const onePull: Button = {
  customId: 'onePull',
  run: async (client: Client, interaction: ButtonInteraction) => {
    if (players.get(interaction.user.id)!.currency > 0) {
      const characterData = summon(1, players.get(interaction.user.id)!);
      //if successfully summoned character
      if (characterData) {
        //Create message
        const characterEmbed = new MessageEmbed()
          .setTitle(characterData[0].name + ' from ' + characterData[0].anime)
          .setImage(characterData[0].image)
          .addField('Rarity', characterData[0].rarity);
        await interaction.followUp({
          embeds: [characterEmbed],
        });
        //remove currency b/c of cost of summon
        players.get(interaction.user.id)!.currency -= 100;
        //update summon message to reflect new amount of husks
        await interaction.editReply({
          content:
            '**Select a button to summon**\nHusks: ' +
            players.get(interaction.user.id)?.currency,
        });
        players.get(interaction.user.id)!.save();
        createCharacter(players.get(interaction.user.id)!, characterData[0]);
      } else {
        await interaction.followUp({
          content:
            'I need some time to catch up to requests, please wait and try again later.',
        });
      }
    } else {
      await interaction.followUp({
        content: 'Sorry, you are out of husks',
      });
    }
  },
};
