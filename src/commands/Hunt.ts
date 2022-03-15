//Command for starting a duel with a provided player.
//Important files: modDenyDuel.ts and modAcceptDuel.ts

import {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from 'discord.js';
import {Command} from '../typings/Command';
import {players} from '../globals';
import Player from '../models/Players';
import {bots} from '../game_logic/botLogic';

export const Hunt: Command = {
  name: 'hunt',
  description: 'Search for bots to challenge',
  type: 'CHAT_INPUT',
  ephemeral: false,
  run: async (client: Client, interaction: CommandInteraction) => {
    //If new player
    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, player));
      await interaction.followUp({
        content:
          'You are a new user and have never summoned before. Try using /summon first',
      });
    }
    //if primary character not set
    else if (!players.get(interaction.user.id)!.primaryCharacter) {
      await interaction.followUp({
        content: 'You need to set your primary character before hunting.',
      });
    }
    //primary Character is dead
    else if (!players.get(interaction.user.id)!.primaryCharacter?.isAlive) {
      await interaction.followUp({
        content: 'You cannot hunt with a dead character!',
      });
    }
    //Safe to use command
    else {
      //Enemy/bot selection menu
      const selectionOptions: MessageSelectOptionData[] = bots.map(
        (bot, index) => {
          var label: string = '';
          const powerDiff: number =
            players.get(interaction.user.id)!.primaryCharacter!.power -
            bot.power;
          if (powerDiff > 1000) label = 'trivial';
          else if (powerDiff > 100) label = 'weak';
          else if (powerDiff > 0) label = 'average';
          if (powerDiff <= 0) label = 'challenging';
          if (powerDiff < -100) label = 'menacing';
          if (powerDiff < -1000) label = 'terrifying';
          return {
            label: label + ' enemy',
            value: index.toString(),
          };
        }
      );
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('selectTarget')
          .setPlaceholder('Choose target')
          .setMaxValues(1)
          .addOptions(selectionOptions)
      );

      //Valid duel
      await interaction.followUp({
        ephemeral: false,
        content: 'Found ' + bots.length + ' enemies. Select one to fight',
        components: [row],
      });
    }
  },
};
