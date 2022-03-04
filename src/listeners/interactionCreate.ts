import {
  BaseCommandInteraction,
  ButtonInteraction,
  Client,
  Interaction,
} from "discord.js";
import { Commands } from "../Commands";
import { Buttons } from "../Buttons";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      await handleSlashCommand(client, interaction);
    } else if (interaction.isButton()) {
      await handleButton(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: BaseCommandInteraction
): Promise<void> => {
  var ephemeral;
  const slashCommand = Commands.find((c) => {
    if (c.name === interaction.commandName) {
      ephemeral = c.ephemeral;
      return true;
    }
  });
  if (!slashCommand) {
    interaction.followUp({ content: "An error has occurred" });
    return;
  }

  await interaction.deferReply({ ephemeral: ephemeral });

  slashCommand.run(client, interaction);
};

const handleButton = async (
  client: Client,
  interaction: ButtonInteraction
): Promise<void> => {
  const button = Buttons.find((b) => b.customId === interaction.customId);
  if (!button) {
    interaction.followUp({ content: "An error has occured" });
    return;
  }

  await interaction.deferReply();

  button.run(client, interaction);
};
