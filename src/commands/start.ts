import {
  SlashCommandBuilder,
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMemberRoleManager,
  MessageFlags,
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
    const allowedRoleId = process.env.PERMITTED_ROLE
    const member = interaction.member

    if (!member || !("roles" in member)) {
      return interaction.reply({
        content: "❌ You must be in a server to use this command.",
        flags: [MessageFlags.Ephemeral],
      })
    }

    // ✅ Fix: Ensure roles are checked properly
    const roles = member.roles as GuildMemberRoleManager
    if (!roles.cache.has(allowedRoleId!)) {
      return interaction.reply({
        content: `❌ You do not have permission to use this command. Only members with the required role can start competitions.`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    const options = interaction.options as CommandInteractionOptionResolver
    const week = options.getInteger("week", true)
    const category = options.getString("category", true)

    // Retrieve the correct competition
    const competition = competitions.find(
      (comp) => comp.week === week && comp.category === category
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ No competition found for **Week ${week} - ${category}**.`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    // Send the competition message
    const message = createCompetitionMessage(competition)
    await interaction.reply(message)
  },
}

export default startCommand
