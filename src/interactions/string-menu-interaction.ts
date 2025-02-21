import { MessageFlags, ComponentType, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import type { StringSelectMenuInteraction } from "discord.js";
import { competitions } from "../messages/competitions";
import updateBubble from "../utils/update-bubble";
import { studentAnswerResponse } from "../messages/bot-response";

const userSelectResponses = new Map<string, Set<string>>();

export default async function onStringSelectMenuInteraction(interaction: StringSelectMenuInteraction) {
  const userResponse = (interaction as StringSelectMenuInteraction).values[0];
  const competition = competitions.find((comp) => comp.options?.includes(userResponse));

  if (!competition) {
    return interaction.reply({
      content: `❌ Unable to find competition for this selection.`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  const messageId = interaction.message?.id;
  const userId = interaction.user.id;

  if (messageId) {
    // Initialize map entry if needed
    if (!userSelectResponses.has(messageId)) {
      userSelectResponses.set(messageId, new Set());
    }

    const respondedUsers = userSelectResponses.get(messageId)!;

    // Prevent duplicate submissions
    if (respondedUsers.has(userId)) {
      return interaction.reply({
        content: "❌ You have already submitted a response for this competition.",
        flags: [MessageFlags.Ephemeral],
      });
    }

    // Mark user as having submitted a response
    respondedUsers.add(userId);
  }

  const isCorrect = Array.isArray(competition.correctAnswer)
    ? competition.correctAnswer.includes(userResponse)
    : competition.correctAnswer === userResponse;

  // Create disabled version of the dropdown
  // const disabledComponents = interaction.message.components.map((row) => {
  //   const newRow = new ActionRowBuilder<StringSelectMenuBuilder>();
  //   row.components.forEach((component) => {
  //     if (component.type === ComponentType.StringSelect) {
  //       newRow.addComponents(
  //         StringSelectMenuBuilder.from(component as any)
  //           .setDisabled(true)
  //           .setPlaceholder("Answer submitted"),
  //       );
  //     }
  //   });
  //   return newRow;
  // });

  // // Update the original message with disabled dropdown
  // await interaction.message.edit({
  //   components: disabledComponents,
  // });

  await studentAnswerResponse(interaction, isCorrect, competition);

  await updateBubble({
    interaction: interaction,
    competition: competition,
    user_response: userResponse,
  });
}
