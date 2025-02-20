import {
  MessageFlags,
  ComponentType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from "discord.js"
import type { StringSelectMenuInteraction } from "discord.js"
import { competitions } from "../messages/competitions"
import updateBubble from "../utils/update-bubble"

export default async function onStringSelectMenuInteraction(
  interaction: StringSelectMenuInteraction
) {
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

  const isCorrect = Array.isArray(competition.correctAnswer)
    ? competition.correctAnswer.includes(userResponse)
    : competition.correctAnswer === userResponse

  // Create disabled version of the dropdown
  const disabledComponents = interaction.message.components.map((row) => {
    const newRow = new ActionRowBuilder<StringSelectMenuBuilder>()
    row.components.forEach((component) => {
      if (component.type === ComponentType.StringSelect) {
        newRow.addComponents(
          StringSelectMenuBuilder.from(component as any)
            .setDisabled(true)
            .setPlaceholder("Answer submitted")
        )
      }
    })
    return newRow
  })

  // Update the original message with disabled dropdown
  await interaction.message.edit({
    components: disabledComponents,
  })

  await interaction.reply({
    content: isCorrect
      ? competition.onSuccessMessage || "✅ Correct answer! 🎉"
      : competition.onWrongMessage ||
        `❌ Incorrect answer. The correct answer was: **${competition.correctAnswer}**.`,
    flags: [MessageFlags.Ephemeral],
  })

  await updateBubble({
    interaction: interaction,
    competition: competition,
    user_response: userResponse,
  })
}
