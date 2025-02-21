import {
  MessageFlags,
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  DMChannel,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import type { ButtonInteraction, Message, ReadonlyCollection } from "discord.js";
import { competitions } from "../messages/competitions";
import { createModal } from "../utils/handlers";
import updateBubble from "../utils/update-bubble";

function getCompetitionFromButton(customId: string, prefix: string) {
  const competitionName = customId.replace(prefix, "");
  const competition = competitions.find((comp) => comp.name === competitionName);

  return { competition: competition, competitionName: competitionName };
}

const userInteractionMap = new Map<string, Set<string>>();

export default async function onButtonInteraction(interaction: ButtonInteraction) {
  const messageId = interaction.message.id;
  const userId = interaction.user.id;

  // Initialize map entry if it doesn't exist
  if (!userInteractionMap.has(messageId)) {
    userInteractionMap.set(messageId, new Set());
  }

  const interactedUsers = userInteractionMap.get(messageId)!;

  // Prevent user from interacting again
  if (interactedUsers.has(userId)) {
    return interaction.reply({
      content: "❌ You have already submitted a response for this competition.",
      flags: [MessageFlags.Ephemeral],
    });
  }

  // Mark user as having interacted
  interactedUsers.add(userId);

  // Handle special submission button click: modal OR image
  if (interaction.customId.startsWith("answer_")) {
    const { competition, competitionName } = getCompetitionFromButton(interaction.customId, "answer_");

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition: **${competitionName}**`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    const modal = createModal(competition);
    await interaction.showModal(modal);
  } // Handle image submission
  else if (interaction.customId.startsWith("submit_image_")) {
    try {
      await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

      const { competition, competitionName } = getCompetitionFromButton(interaction.customId, "submit_image_");

      if (!competition) {
        await interaction.editReply({
          content: `❌ Unable to find competition: **${competitionName}**`,
        });
        return;
      }

      // Type guard to check if channel supports message collector
      const channel = interaction.channel;
      if (
        !(channel instanceof TextChannel) &&
        !(channel instanceof DMChannel) &&
        !(channel instanceof NewsChannel) &&
        !(channel instanceof ThreadChannel)
      ) {
        await interaction.editReply({
          content: "❌ This type of channel doesn't support image submissions.",
        });
        return;
      }

      // Create collector before sending instructions
      const collector = channel.createMessageCollector({
        filter: (msg: Message) => msg.author.id === interaction.user.id && msg.attachments.size > 0,
        max: 1,
      });

      // Send instructions
      await interaction.editReply({
        content: `Please upload your image in the next message.`,
      });

      collector.on("collect", async (message: Message) => {
        const imageUrl = message.attachments.first()?.url;

        if (!imageUrl) {
          await interaction.editReply({
            content: "❌ No image was found in your message.",
          });
          collector.stop();
          return;
        }

        try {
          // Create disabled version of the submit button
          // const disabledComponents = interaction.message?.components.map((row) => {
          //   const newRow = new ActionRowBuilder<ButtonBuilder>();
          //   row.components.forEach((component) => {
          //     if (component.type === ComponentType.Button) {
          //       newRow.addComponents(
          //         ButtonBuilder.from(component as any)
          //           .setDisabled(true)
          //           .setLabel("Image Submitted")
          //           .setStyle(ButtonStyle.Secondary),
          //       );
          //     }
          //   });
          //   return newRow;
          // });

          // // Update the original competition message with disabled button
          // if (interaction.message) {
          //   await interaction.message.edit({
          //     components: disabledComponents,
          //   });
          // }

          // First update Bubble
          await updateBubble({
            interaction: interaction,
            competition: competition,
            user_response: imageUrl,
          });

          // Delete the uploaded image message
          try {
            await message.delete();
          } catch (deleteError) {
            console.error("Failed to delete message:", deleteError);
          }

          // Then, only if updateBubble was successful, update the reply
          await interaction.editReply({
            content: "✅ Your image has been submitted successfully!",
          });
        } catch (error) {
          console.error("Error handling image submission:", error);
          // Make sure we're only editing the reply, not creating a new one
          await interaction.editReply({
            content: "❌ There was an error processing your submission. Please try again.",
          });
        }
      });

      collector.on("end", (collected: ReadonlyCollection<string, Message>, reason: string) => {
        if (collected.size === 0) {
          interaction
            .editReply({
              content: "❌ No image was submitted.",
            })
            .catch(console.error);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
      }
      await interaction.editReply({
        content: "❌ There was an error processing your request.",
      });
    }
  } // Handle button submission
  else {
    const userResponse = interaction.customId;
    const competition = competitions.find((comp) => comp.options?.includes(userResponse));

    if (!competition) {
      return interaction.reply({
        content: `❌ Unable to find competition for this selection.`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    const isCorrect = Array.isArray(competition.correctAnswer)
      ? competition.correctAnswer.includes(userResponse)
      : competition.correctAnswer === userResponse;

    // Create disabled version of the buttons
    // const disabledComponents = interaction.message.components.map((row) => {
    //   const newRow = new ActionRowBuilder<ButtonBuilder>();
    //   row.components.forEach((component) => {
    //     if (component.type === ComponentType.Button) {
    //       newRow.addComponents(
    //         ButtonBuilder.from(component as any)
    //           .setDisabled(true)
    //           .setStyle(component.customId === userResponse ? ButtonStyle.Primary : ButtonStyle.Secondary),
    //       );
    //     }
    //   });
    //   return newRow;
    // });

    // // Update the original message with disabled buttons
    // await interaction.message.edit({
    //   components: disabledComponents,
    // });

    await interaction.reply({
      content: isCorrect
        ? competition.onSuccessMessage || "✅ Correct answer! 🎉"
        : competition.onWrongMessage ||
          `❌ Incorrect answer. The correct answer was: **${competition.correctAnswer}**.`,
      flags: [MessageFlags.Ephemeral],
    });

    await updateBubble({
      interaction: interaction,
      competition: competition,
      user_response: userResponse,
    });
  }
}
