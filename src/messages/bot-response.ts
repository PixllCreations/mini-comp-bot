import type { CompHeadings, ResponseType } from "../interfaces"

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

// Success message sent to admin after mini challenge launch

function adminLaunchResponse(
  week: number,
  competition: string,
  numChannels: number
) {
  console.log(
    competition
      .toLowerCase()
      .replace(/(?:^\w|\b\w)/g, (match, index) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, "")
  )
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
  return `# [🏆Mini Challenges: Week ${week}] ${compHeadings[category]}\n\u200B\n${instructions}`
}

export { adminLaunchResponse, defaultBotResponse, formatCompInstructions }
