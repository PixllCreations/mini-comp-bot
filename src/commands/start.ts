import {
  SlashCommandBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  MessageFlags,
  TextChannel,
  GuildMemberRoleManager,
} from "discord.js"
import { competitions } from "../messages/competitions"
import { createCompetitionMessage } from "../handlers"
import dotenv from "dotenv"

dotenv.config()

const startCommand = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Start a specific competition based on week and category")
    .addIntegerOption((option) =>
      option
        .setName("week")
        .setDescription("Select the competition week")
        .setRequired(true)
        .addChoices(
          { name: "Week 1", value: 1 },
          { name: "Week 2", value: 2 },
          { name: "Week 3", value: 3 },
          { name: "Week 4", value: 4 },
          { name: "Week 5", value: 5 },
          { name: "Week 6", value: 6 }
        )
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

    if (interaction.guild) {
      const allowedRoleId = process.env.ALLOWED_ROLE_ID
      const member = interaction.member

      if (!member || !("roles" in member)) {
        return interaction.reply({
          content: "❌ You must be in a server to use this command.",
          flags: [MessageFlags.Ephemeral],
        })
      }

      const roles = member.roles as GuildMemberRoleManager
      if (!roles.cache.has(allowedRoleId!)) {
        return interaction.reply({
          content: "❌ You do not have permission to use this command.",
          flags: [MessageFlags.Ephemeral],
        })
      }
    }

    const competition = competitions.find(
      (comp) => comp.week === week && comp.category === category
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ No competition found for **Week ${week} - ${category}**.`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    try {
      const message = createCompetitionMessage(competition)
      console.log("Sending message:", JSON.stringify(message, null, 2)) // Debug log

      // For manually created interactions from /minibatch
      if (!interaction.reply) {
        const channel = interaction.channel as TextChannel
        await channel.send(message)
        return
      }

      // For normal command interactions
      await interaction.reply(message)
    } catch (error) {
      console.error("Error sending message:", error)
      if (interaction.reply) {
        await interaction.reply({
          content: "❌ There was an error sending the competition message.",
          flags: [MessageFlags.Ephemeral],
        })
      }
    }
  },
}

export default startCommand
