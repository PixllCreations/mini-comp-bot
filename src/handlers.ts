import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import type { Competition } from "./interfaces"

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

  return {
    content: `**${competition.name}**\n${competition.instructions}\n\n**Prompt:** ${competition.prompt}`,
    components,
  }
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
