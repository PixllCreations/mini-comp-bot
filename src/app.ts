import { Client, GatewayIntentBits, Collection, MessageFlags } from "discord.js"
import type {
  Interaction,
  StringSelectMenuInteraction,
  ButtonInteraction,
} from "discord.js"
import { BOT_TOKEN } from "./config"
import { miniBatchCommand, startCommand } from "./commands/index"
import { competitions } from "./messages/competitions"
import { createModal } from "./handlers"
import updateBubble from "./update-bubble"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Store commands in a Collection
const commands = new Collection<string, any>()
commands.set(startCommand.data.name, startCommand)
commands.set(miniBatchCommand.data.name, miniBatchCommand)

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)
})

client.on("interactionCreate", async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName)
    if (!command) return

    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
      await interaction.reply({
        content: "❌ There was an error executing this command!",
        flags: [MessageFlags.Ephemeral],
      })
    }
  }

  // ✅ Handle "Answer" button click to trigger the modal
  if (interaction.isButton() && interaction.customId.startsWith("answer_")) {
    const competitionName = interaction.customId.replace("answer_", "")
    const competition = competitions.find(
      (comp) => comp.name === competitionName
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition: **${competitionName}**`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    const modal = createModal(competition)
    await interaction.showModal(modal)
  }

  // ✅ Handle dropdown (select menu) answer submission
  if (interaction.isStringSelectMenu()) {
    const userResponse = (interaction as StringSelectMenuInteraction).values[0]
    const competition = competitions.find((comp) =>
      comp.options?.includes(userResponse)
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition for this selection.`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    // ✅ Validate the answer
    const isCorrect = Array.isArray(competition.correctAnswer)
      ? competition.correctAnswer.includes(userResponse)
      : competition.correctAnswer === userResponse

    await interaction.reply({
      content: isCorrect
        ? competition.onSuccessMessage || "✅ Correct answer! 🎉"
        : competition.onWrongMessage ||
          `❌ Incorrect answer. The correct answer was: **${competition.correctAnswer}**.`,
      flags: [MessageFlags.Ephemeral],
    })

    // ✅ Send the answer to Bubble.io
    await updateBubble({
      interaction: interaction,
      competition_title: competition.name,
    })
  }

  // ✅ Handle button (Yes/No) responses (Cyber Security Competitions)
  if (interaction.isButton() && !interaction.customId.startsWith("answer_")) {
    const userResponse = interaction.customId
    const competition = competitions.find((comp) =>
      comp.options?.includes(userResponse)
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition for this selection.`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    // ✅ Validate the answer
    const isCorrect = Array.isArray(competition.correctAnswer)
      ? competition.correctAnswer.includes(userResponse)
      : competition.correctAnswer === userResponse

    await interaction.reply({
      content: isCorrect
        ? competition.onSuccessMessage || "✅ Correct answer! 🎉"
        : competition.onWrongMessage ||
          `❌ Incorrect answer. The correct answer was: **${competition.correctAnswer}**.`,
      flags: [MessageFlags.Ephemeral],
    })

    // ✅ Send the answer to Bubble.io
    await updateBubble({
      interaction: interaction,
      competition_title: competition.name,
    })
  }

  // ✅ Handle modal submissions (Text-based answers)
  if (interaction.isModalSubmit()) {
    const response = interaction.fields.getTextInputValue(
      "competition_response"
    )
    const competitionName = interaction.customId.replace("modal_", "")
    const competition = competitions.find(
      (comp) => comp.name === competitionName
    )

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition: **${competitionName}**`,
        flags: [MessageFlags.Ephemeral],
      })
    }

    // ✅ If `correctAnswer` exists, validate it
    if (competition.correctAnswer) {
      const isCorrect = Array.isArray(competition.correctAnswer)
        ? competition.correctAnswer.includes(response.trim())
        : competition.correctAnswer === response.trim()

      await interaction.reply({
        content: isCorrect
          ? competition.onSuccessMessage || "✅ Correct answer! 🎉"
          : competition.onWrongMessage ||
            `❌ Incorrect answer. The correct answer was: **${competition.correctAnswer}**.`,
        flags: [MessageFlags.Ephemeral],
      })
    } else {
      // ✅ If `correctAnswer` does not exist, just acknowledge the response
      await interaction.reply({
        content: "Thanks for answering, nice work! 🎉",
        flags: [MessageFlags.Ephemeral],
      })
    }

    // ✅ Send the answer to Bubble.io
    await updateBubble({
      interaction: interaction,
      competition_title: competition.name,
    })
  }
})

// Start the bot
client.login(BOT_TOKEN)
