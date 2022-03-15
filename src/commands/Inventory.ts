//Lists a player's owned characters and their associated id's

import {BaseCommandInteraction, Client} from 'discord.js';
import {Command} from '../typings/Command';
import {players} from '../globals';
import Player from '../models/Players';

export const Inventory: Command = {
  name: 'inventory',
  description: 'Check your character inventory',
  type: 'CHAT_INPUT',
  ephemeral: true,
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    //if new user
    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, player));
      await interaction.followUp({
        content:
          'You are a new user and have never summoned before. Try using /summon first',
      });
    } else {
      const player = players.get(interaction.user.id)!;
      //get characters from database in power descending order
      const characters = await player.getCharacters({
        attributes: ['name', 'rarity', 'id'],
        order: [['power', 'DESC']],
      });
      //if no characters
      if (characters.length == 0) {
        await interaction.followUp({
          content: 'You have no characters. Try using /summon first',
        });
      } else {
        //May need to send multiple messages to display all characters
        var messages = [
          player.primaryCharacter
            ? 'Primary: **' +
              player.primaryCharacter.name +
              player.primaryCharacter.rarity +
              '** \n\n'
            : '',
        ];
        var index = 0;
        //for each character, add it to the message and start
        //a new message when length cap is reached
        //strikethrough character if dead
        characters?.forEach((character) => {
          if (messages[index].length < 1900)
            messages[index] +=
              '[' + character.id.toString() + ']' + character.isAlive
                ? character.name
                : '~~' + character.name + '~~' + character.rarity + '     ';
          else {
            messages.push('');
            index++;
          }
        });
        //for each message in messages, send a message
        await messages.forEach(async (message) => {
          await interaction.followUp({
            ephemeral: true,
            content: message,
          });
        });
      }
    }
  },
};
