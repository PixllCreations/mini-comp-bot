import {
  MessageFlags,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import type { ModalSubmitInteraction } from "discord.js"
import { competitions } from "../messages/competitions"
import updateBubble from "../utils/update-bubble"
import { onChallengeComplete } from "../messages/bot-response"

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
      content: onChallengeComplete(competition, isCorrect),
      flags: [MessageFlags.Ephemeral],
    })
  } else {
    // If `correctAnswer` does not exist, just acknowledge the response
    await interaction.reply({
      content: "Thanks for answering, nice work! 🎉",
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
