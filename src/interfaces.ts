import type { Interaction } from "discord.js"

export interface Competition {
  name: string
  week: number
  category: "Cyber" | "Digital Marketing" | "Data Science"
  instructions: string
  image?: string
  prompt: string
  inputType: "button" | "dropdown" | "text" | "image"
  options?: string[]
  correctAnswer?: string | string[]
  onSuccessMessage?: string
  onWrongMessage?: string
}

export interface UpdateBubbleProps {
  interaction: Interaction
  competition: Competition
  user_response: string
}
