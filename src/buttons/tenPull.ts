//Perform a ten summons if the player has enough husks.

import {ButtonInteraction, Client, MessageEmbed} from 'discord.js';
import {Button} from '../typings/Button';
import {players} from '../globals';
import {createCharacter} from '../game_logic/characterCreationLogic';
import {summon} from '../game_logic/summonLogic';
import {ReqCharacterData} from 'src/typings/CharacterData';

export const tenPull: Button = {
  customId: 'tenPull',
  run: async (client: Client, interaction: ButtonInteraction) => {
    if (players.get(interaction.user.id)!.currency >= 1000) {
      const characterData = summon(10, players.get(interaction.user.id)!);
      //if characters successfully summoned
      if (characterData) {
        //create message for each character gotten
        const characterEmbeds = characterData.map(
          (characterData: ReqCharacterData) =>
            new MessageEmbed()
              .setTitle(characterData.name + ' from ' + characterData.anime)
              .setImage(characterData.image_med)
              .addField('Rarity', characterData.rarity)
        );

        await interaction.followUp({
          embeds: characterEmbeds,
        });
        //remove currency because of summon
        players.get(interaction.user.id)!.currency -= 1000;
        //update message to reflect number of husks
        await interaction.editReply({
          content:
            '**Select a button to summon**\nHusks: ' +
            players.get(interaction.user.id)?.currency,
        });
        players.get(interaction.user.id)!.save();
        characterData.forEach((characterData) =>
          createCharacter(players.get(interaction.user.id)!, characterData)
        );
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
