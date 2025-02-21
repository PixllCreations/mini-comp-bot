import {
  ButtonInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js"
import type { Competition, CompHeadings, ResponseType } from "../interfaces"

// Default success and failure messages when students answer

function defaultBotResponse(
  response: keyof ResponseType,
  correctAnswer?: string | string[]
) {
  const defaultResponse: ResponseType = {
    onSuccessMessage: "✅ Nice work, you're crushing it! 🎉",
    onWrongMessage: `❌ Sorry, that is incorrect. The correct answer was: **${correctAnswer}**.`,
  }

  return defaultResponse[response]
}

// Message sent to students when they submit an answer

async function studentAnswerResponse(
  interaction:
    | StringSelectMenuInteraction
    | ModalSubmitInteraction
    | ButtonInteraction,
  isCorrect: boolean,
  competition: Competition
) {
  const plug = `You just got **500** Silver Coins:money_with_wings: :moneybag:! Head on over to [The NØTWØRK](https://thenotwork.org/challenges)`

  await interaction.reply({
    content: isCorrect
      ? `${
          competition.onSuccessMessage || defaultBotResponse("onSuccessMessage")
        }\n\u200B\n${plug}`
      : `${
          competition.onWrongMessage ||
          defaultBotResponse("onWrongMessage", competition.correctAnswer)
        }\n\u200B\n${plug}`,
    flags: [MessageFlags.Ephemeral],
  })
}

// Success message sent to admin after mini challenge launch

function adminLaunchResponse(
  week: number,
  competition: string,
  numChannels: number
) {
  return `# [Launched] ${
    compHeadings[
      competition
        .toLowerCase()
        .replace(/(?:^\w|\b\w)/g, (match, index) =>
          index === 0 ? match.toLowerCase() : match.toUpperCase()
        )
        .replace(/\s+/g, "") as keyof typeof compHeadings
    ]
  }\nMini Challenge [Week ${week}] :rocket:launched in **${numChannels}** channels`
}

// Initial message sent to students to introduce and explain the mini comp

const compHeadings: CompHeadings = {
  cybersecurity: "Cybersecurity 💻🔐👾",
  contentCreation: "Content Creation :selfie:🎆📢",
  dataScience: "Data Science 📊📉🔍",
}

function formatCompInstructions(
  week: number,
  category: keyof CompHeadings,
  instructions: string
) {
  const plug =
    "Participate to win 500 Silver Coins on The NØTWØRK! Head on over **`thenotwork.org/challenges`** to more exciting challenges!"
  return `# [🏆Mini Challenges: Week ${week}] ${compHeadings[category]}\n\u200B\n**${plug}**\n\u200B\n${instructions}\n\u200B\n`
}

export {
  adminLaunchResponse,
  studentAnswerResponse,
  defaultBotResponse,
  formatCompInstructions,
}
