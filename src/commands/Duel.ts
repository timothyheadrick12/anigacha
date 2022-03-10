import {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import {OptionCommand} from '../typings/OptionCommand';
import {players} from '../globals';
import {Buttons} from '../Buttons';
import Player from '../models/Players';
import {createModAcceptDuel} from '../buttons/modAcceptDuel';
import {createModDenyDuel} from '../buttons/modDenyDuel';

export const Duel: OptionCommand = {
  name: 'duel',
  description: 'Challenge a given player to a duel',
  type: 'CHAT_INPUT',
  options: [
    {
      name: 'player',
      description: 'Name of the player you want to challenge',
      type: 6, //type user
      required: true,
    },
  ],
  ephemeral: false,
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!players.has(interaction.user.id)) {
      Player.create({
        id: interaction.user.id,
        name: interaction.user.username,
      }).then((player) => players.set(player.id, player));
      await interaction.followUp({
        content:
          'You are a new user and have never summoned before. Try using /summon first',
      });
    } else if (!players.get(interaction.user.id)!.primaryCharacter) {
      await interaction.followUp({
        content:
          'You need to set your primary character before challenging someone to a duel.',
      });
    } else if (players.get(interaction.user.id)!.inDuel) {
      await interaction.followUp({
        content: 'You cannot duel two people at once!',
      });
    } else {
      const oppPlayer = interaction.options.getUser('player', true);
      const buttonRow = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(
            'modAcceptDuel_f_' + interaction.user.id + '_t_' + oppPlayer.id
          )
          .setLabel('Accept')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId(
            'modDenyDuel_f_' + interaction.user.id + '_t_' + oppPlayer.id
          )
          .setLabel('Deny')
          .setStyle('PRIMARY')
      );

      Buttons.push(createModAcceptDuel(interaction.user.id, oppPlayer.id));
      Buttons.push(createModDenyDuel(interaction.user.id, oppPlayer.id));

      await interaction.followUp({
        ephemeral: false,
        content:
          interaction.user.username +
          ' has challenged ' +
          oppPlayer.toString() +
          ' to a duel! Will they accept?',
        components: [buttonRow],
      });
    }
  },
};
