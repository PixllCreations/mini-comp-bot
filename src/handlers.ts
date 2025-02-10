import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} from "discord.js"
import type { Competition } from "./interfaces"

const DISCORD_MAX_LENGTH = 2000

function splitMessage(content: string): string[] {
  const messages: string[] = []
  let currentMessage = ""

  const lines = content.split("\n")

  for (const line of lines) {
    if (currentMessage.length + line.length + 1 > DISCORD_MAX_LENGTH) {
      messages.push(currentMessage)
      currentMessage = line
    } else {
      currentMessage += (currentMessage ? "\n" : "") + line
    }
  }

  if (currentMessage) {
    messages.push(currentMessage)
  }

  return messages
}

export function createCompetitionMessage(competition: Competition) {
  const components: any[] = []

  if (competition.inputType === "button" && competition.options) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      competition.options.map((option) =>
        new ButtonBuilder()
          .setCustomId(option)
          .setLabel(option)
          .setStyle(ButtonStyle.Primary)
      )
    )
    components.push(row)
  }

  if (competition.inputType === "dropdown" && competition.options) {
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("competition_dropdown")
        .setPlaceholder("Select an answer")
        .addOptions(
          competition.options.map((option) => ({
            label: option,
            value: option,
          }))
        )
    )
    components.push(row)
  }

  if (competition.inputType === "text") {
    // ✅ Add "Answer" button to trigger the modal
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`answer_${competition.name}`)
        .setLabel("Answer")
        .setStyle(ButtonStyle.Primary)
    )
    components.push(row)
  }

  const embededImage = competition.image
    ? new EmbedBuilder().setImage(competition.image).setColor(0x00fd65)
    : null

  const content = `**${competition.name}**\n${competition.instructions}\n\n**Prompt:** ${competition.prompt}`
  const messages = splitMessage(content)

  // return {
  //   content: `**${competition.name}**\n${competition.instructions}\n\n**Prompt:** ${competition.prompt}`,
  //   embeds: embededImage ? [embededImage] : [],
  //   components,
  // }
  return messages.map((msg, index) => ({
    content: msg,
    embeds: index === messages.length - 1 && embededImage ? [embededImage] : [],
    components: index === messages.length - 1 ? components : [],
  }))
}

export function createModal(competition: Competition) {
  return new ModalBuilder()
    .setCustomId(`modal_${competition.name}`)
    .setTitle(competition.name)
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("competition_response")
          .setLabel("Your Answer")
          .setStyle(TextInputStyle.Paragraph)
      )
    )
}
