import {
  Client,
  GatewayIntentBits,
  Collection,
  MessageFlags,
  ComponentType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  DMChannel,
  NewsChannel,
  TextChannel,
  ThreadChannel,
} from "discord.js"
import type {
  Interaction,
  StringSelectMenuInteraction,
  ButtonInteraction,
  Message,
  ReadonlyCollection,
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
  } else if (interaction.isButton()) {
    // Handle special submission button click: modal OR image
    if (interaction.customId.startsWith("answer_")) {
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
    } // Handle image submission
    else if (interaction.customId.startsWith("submit_image_")) {
      try {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })

        const competitionName = interaction.customId.replace(
          "submit_image_",
          ""
        )
        const competition = competitions.find(
          (comp) => comp.name === competitionName
        )

        if (!competition) {
          await interaction.editReply({
            content: `❌ Unable to find competition: **${competitionName}**`,
          })
          return
        }

        // Type guard to check if channel supports message collector
        const channel = interaction.channel
        if (
          !(channel instanceof TextChannel) &&
          !(channel instanceof DMChannel) &&
          !(channel instanceof NewsChannel) &&
          !(channel instanceof ThreadChannel)
        ) {
          await interaction.editReply({
            content:
              "❌ This type of channel doesn't support image submissions.",
          })
          return
        }

        // Create collector before sending instructions
        const timeLimit = 60000
        const collector = channel.createMessageCollector({
          filter: (msg: Message) =>
            msg.author.id === interaction.user.id && msg.attachments.size > 0,
          max: 1,
          // time: timeLimit,
        })

        // Send instructions
        await interaction.editReply({
          content: `Please upload your image in the next message. You have ${
            timeLimit / 1000
          } seconds to submit.`,
        })

        collector.on("collect", async (message: Message) => {
          const imageUrl = message.attachments.first()?.url

          if (!imageUrl) {
            await interaction.editReply({
              content: "❌ No image was found in your message.",
            })
            collector.stop()
            return
          }

          try {
            // Create disabled version of the submit button
            const disabledComponents = interaction.message?.components.map(
              (row) => {
                const newRow = new ActionRowBuilder<ButtonBuilder>()
                row.components.forEach((component) => {
                  if (component.type === ComponentType.Button) {
                    newRow.addComponents(
                      ButtonBuilder.from(component as any)
                        .setDisabled(true)
                        .setLabel("Image Submitted")
                        .setStyle(ButtonStyle.Secondary)
                    )
                  }
                })
                return newRow
              }
            )

            // Update the original competition message with disabled button
            if (interaction.message) {
              await interaction.message.edit({
                components: disabledComponents,
              })
            }

            // First update Bubble
            await updateBubble({
              interaction: interaction,
              competition: competition,
              user_response: imageUrl,
            })

            // Delete the uploaded image message
            try {
              await message.delete()
            } catch (deleteError) {
              console.error("Failed to delete message:", deleteError)
            }

            // Then, only if updateBubble was successful, update the reply
            await interaction.editReply({
              content: "✅ Your image has been submitted successfully!",
            })
          } catch (error) {
            console.error("Error handling image submission:", error)
            // Make sure we're only editing the reply, not creating a new one
            await interaction.editReply({
              content:
                "❌ There was an error processing your submission. Please try again.",
            })
          }
        })

        collector.on(
          "end",
          (collected: ReadonlyCollection<string, Message>, reason: string) => {
            if (collected.size === 0) {
              interaction
                .editReply({
                  content: "❌ No image was submitted within the time limit.",
                })
                .catch(console.error)
            }
          }
        )
      } catch (error) {
        console.error("Error:", error)
        if (!interaction.replied && !interaction.deferred) {
          await interaction.deferReply({ flags: [MessageFlags.Ephemeral] })
        }
        await interaction.editReply({
          content: "❌ There was an error processing your request.",
        })
      }
    } // Handle button submission
    else {
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

      const isCorrect = Array.isArray(competition.correctAnswer)
        ? competition.correctAnswer.includes(userResponse)
        : competition.correctAnswer === userResponse

      // Create disabled version of the buttons
      const disabledComponents = interaction.message.components.map((row) => {
        const newRow = new ActionRowBuilder<ButtonBuilder>()
        row.components.forEach((component) => {
          if (component.type === ComponentType.Button) {
            newRow.addComponents(
              ButtonBuilder.from(component as any)
                .setDisabled(true)
                .setStyle(
                  component.customId === userResponse
                    ? ButtonStyle.Primary
                    : ButtonStyle.Secondary
                )
            )
          }
        })
        return newRow
      })

      // Update the original message with disabled buttons
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
  } // Handle dropdown (select menu) answer submission
  else if (interaction.isStringSelectMenu()) {
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
  } // Handle modal submissions (text-based answers)
  else if (interaction.isModalSubmit()) {
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
})

// Start the bot
client.login(BOT_TOKEN)
