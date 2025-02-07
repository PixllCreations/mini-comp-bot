interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

export function defaultBotResponse(
  response: keyof ResponseType,
  correctAnswer?: string | string[]
) {
  const defaultResponse: ResponseType = {
    onSuccessMessage: "✅ Nice work, you're crushing it! 🎉",
    onWrongMessage: `❌ Incorrect answer. The correct answer was: **${correctAnswer}**.`,
  }

  return defaultResponse[response]
}
