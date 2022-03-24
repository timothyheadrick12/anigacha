//This is a temporary command for refilling a players husks.

import {CommandInteraction, Client} from 'discord.js';
import {OptionCommand} from '../typings/OptionCommand';
import {players} from '../globals';
import Player from '../models/Players';

export const CreatePassword: OptionCommand = {
  name: 'createpassword',
  description: 'Create a password. DO NOT USE A PASSWORD YOU USE ANYWHERE ELSE',
  type: 'CHAT_INPUT',
  ephemeral: true,
  options: [
    {
      name: 'password',
      description: 'password you want to set for sign in',
      type: 3, //type string
      required: true,
    },
  ],
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
    } else {
      players.get(interaction.user.id)!.password =
        interaction.options.getString('password')!;
      players.get(interaction.user.id)!.save();
      await interaction.followUp({
        content: 'Successfully set password',
      });
    }
  },
};
