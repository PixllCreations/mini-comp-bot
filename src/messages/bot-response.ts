import type { CompHeadings } from "../interfaces"

interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

// ----------------------------------------------------------------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------------------------------------------------------------
// Success message sent to admin after mini challenge launch

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

// ----------------------------------------------------------------------------------------------------------------------------------
// Initial message sent to students to introduce and explain the mini comp

const compHeadings: CompHeadings = {
  cybersecurity: "Cybersecurity 💻🔐👾",
  digitalMarketing: "Digital Marketing :selfie:🎆📢",
  dataScience: "Data Science 📊📉🔍",
}

const newLines = "\n\u200B\n"

function formatCompInstructions(
  week: number,
  category: keyof CompHeadings,
  instructions: string
) {
  return `# [🏆Mini Challenges: Week ${week}] ${compHeadings[category]}${newLines}${instructions}`
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Phishing emails and answers with Markdown

// ----------------------------------------------------------------------------------------------------------------------------------

export { adminLaunchResponse, defaultBotResponse, formatCompInstructions }
