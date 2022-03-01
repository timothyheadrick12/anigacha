import {BaseCommandInteraction, Client, Message, MessageEmbed} from 'discord.js'
import {Command} from '../Command'
import getCharacter from '../requests/getCharacter'

export const Summon: Command = {
  name: 'summon',
  description: 'Summons an anime character',
  type: 'CHAT_INPUT',
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const character = await getCharacter()
    const characterEmbed = new MessageEmbed()
      .setTitle(character.name.full)
      .setImage(character.image.medium)
      .setDescription(character.description)

    await interaction.followUp({
      ephemeral: false,
      embeds: [characterEmbed],
    })
  },
}
