import type { ModalSubmitInteraction } from "discord.js"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from "discord.js"
import { defaultBotResponse } from "../messages/bot-response"
import { competitions } from "../messages/competitions"
import updateBubble from "../utils/update-bubble"

export default async function onModalSubmitInteraction(
  interaction: ModalSubmitInteraction
) {
  const response = interaction.fields.getTextInputValue("competition_response")
  const competitionName = interaction.customId.replace("modal_", "")
  const competition = competitions.find((comp) => comp.name === competitionName)

  if (!competition) {
    return interaction.reply({
      content: `❌ Unable to find competition: **${competitionName}**`,
      flags: [MessageFlags.Ephemeral],
    })
  }

  // If `correctAnswer` exists, validate it
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
    // If `correctAnswer` does not exist, just acknowledge the response
    const plug = `You just got **500** Silver Coins:money_with_wings: :moneybag:! Head on over to [The NØTWØRK](https://thenotwork.org/challenges)`

    await interaction.reply({
      content: `${defaultBotResponse("onSuccessMessage")}\n\u200B\n${plug}`,
      flags: [MessageFlags.Ephemeral],
    })
  }

  // For text input, disable the "Answer" button after submission
  const disabledComponents = interaction.message?.components?.map((row) => {
    const newRow = new ActionRowBuilder<ButtonBuilder>()
    row.components.forEach((component) => {
      if (component.type === ComponentType.Button) {
        newRow.addComponents(
          ButtonBuilder.from(component as any)
            .setDisabled(true)
            .setLabel("Answered")
            .setStyle(ButtonStyle.Secondary)
        )
      }
    })
    return newRow
  })

  // If we have access to the original message, update it
  if (interaction.message) {
    await interaction.message.edit({
      components: disabledComponents,
    })
  }

  await updateBubble({
    interaction: interaction,
    competition: competition,
    user_response: response.trim(),
  })
}
