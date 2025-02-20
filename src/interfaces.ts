import type { Interaction } from "discord.js"

type Category = "Cybersecurity" | "Digital Marketing" | "Data Science"

type InputType = "button" | "dropdown" | "text" | "image"

interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

interface Competition {
  name: string
  week: number
  category: Category
  instructions: string
  image?: string
  prompt?: string
  inputType: InputType
  options?: string[]
  correctAnswer?: string | string[]
  onSuccessMessage?: string
  onWrongMessage?: string
}

interface CompHeadings {
  cybersecurity: string
  digitalMarketing: string
  dataScience: string
}

interface UpdateBubbleProps {
  interaction: Interaction
  competition: Competition
  user_response: string
}

export type { ResponseType, Competition, CompHeadings, UpdateBubbleProps }
