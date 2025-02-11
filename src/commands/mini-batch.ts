import {
  SlashCommandBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextChannel,
  MessageFlags,
} from "discord.js"

import type { GuildTextBasedChannel } from "discord.js"
import dotenv from "dotenv"
import startCommand from "./start"

dotenv.config()

const minBatchCommand = {
  data: new SlashCommandBuilder()
    .setName("minibatch")
    .setDescription(
      "Run the /start competition command in all predefined channels"
    )
    .addIntegerOption((option) =>
      option
        .setName("week")
        .setDescription("Select the competition week")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("Select the competition category")
        .setRequired(true)
        .addChoices(
          { name: "Cyber", value: "Cyber" },
          { name: "Digital Marketing", value: "Digital Marketing" },
          { name: "Data Science", value: "Data Science" }
        )
    ),

  async execute(interaction: CommandInteraction) {
    const option = interaction.options as CommandInteractionOptionResolver
    const week = option.getInteger("week", true)
    const category = option.getString("category", true)
    const targetChannels = process.env.TARGET_CHANNELS?.split(",")

    if (!targetChannels) {
      return interaction.reply({
        content: "❌ No target channels configured.",
        flags: [MessageFlags.Ephemeral],
      })
    }

    // Defer the reply so Discord doesn't time out
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

    let successCount = 0

    for (const channelId of targetChannels) {
      try {
        const channel = await interaction.client.channels.fetch(
          channelId.trim()
        )

        if (channel && channel.isTextBased()) {
          // Manually create a fake interaction response by calling `/start`
          const fakeInteraction = {
            channel: channel as GuildTextBasedChannel,
            options: {
              getInteger: () => week,
              getString: () => category,
            },
            reply: async (message: any) => {
              await (channel as TextChannel).send(message)
            },
          } as unknown as CommandInteraction

          await startCommand.execute(fakeInteraction)
          successCount++
        }
      } catch (error) {
        console.error(
          `❌ Error executing /start in channel ${channelId}:`,
          error
        )
      }
    }

    // Edit the reply with the result
    await interaction.editReply({
      content: `✅ Successfully executed week ${week}'s ${category} mini comp in **${successCount}** channels.`,
    })
  },
}

export default minBatchCommand
