import type { Interaction } from "discord.js"

type Category = "Cybersecurity" | "Content Creation" | "Data Science"

type InputType = "button" | "dropdown" | "text" | "image"

interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

interface Competition {
  // minis_ds_wk01_01 -> last digits are if we have > 1 in same week. If we had two Cybersecurity competitions in one week then we'd have minis_ds_wk01_01 and minis_ds_wk01_02
  slug: `minis_${string}_wk${number}_${number}`
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
  contentCreation: string
  dataScience: string
}

interface UpdateBubbleProps {
  interaction: Interaction
  competition: Competition
  user_response: string
}

export type { ResponseType, Competition, CompHeadings, UpdateBubbleProps }
