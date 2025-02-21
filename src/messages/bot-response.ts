import {
  ButtonInteraction,
  MessageFlags,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  type CommandInteraction,
} from "discord.js"
import type { Competition, CompHeadings, ResponseType } from "../interfaces"

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

function adminLaunchResponse(
  week: number,
  competition: string,
  numChannels: number
) {
  let heading = ""
  switch (competition) {
    case "Cybersecurity":
      heading = "cybersecurity"
      break
    case "Digital Marketing":
      heading = "digitalMarketing"
      break
    case "Data Science":
      heading = "dataScience"
      break
  }

  return `# [Launched] ${
    compHeadings[heading as keyof typeof compHeadings]
  }\nMini Challenge [Week ${week}] :rocket:launched in **${numChannels}** channels`
}

const compHeadings: CompHeadings = {
  cybersecurity: "Cybersecurity 💻🔐👾",
  digitalMarketing: "Digital Marketing :selfie:🎆📢",
  dataScience: "Data Science 📊📉🔍",
}

function formatCompInstructions(
  week: number,
  category: keyof CompHeadings,
  instructions: string
) {
  return `# [🏆Mini Challenges: Week ${week}] ${compHeadings[category]}\n\u200B\n${instructions}`
}

function onChallengeComplete(competition: Competition, isCorrect: boolean) {
  return isCorrect
    ? competition.onSuccessMessage || defaultBotResponse("onSuccessMessage")
    : competition.onWrongMessage ||
        defaultBotResponse("onWrongMessage", competition.correctAnswer)
}

export {
  adminLaunchResponse,
  defaultBotResponse,
  formatCompInstructions,
  onChallengeComplete,
}
