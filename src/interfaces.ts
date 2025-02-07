export interface Competition {
  name: string
  week: number
  category: "Cyber" | "Digital Marketing" | "Data Science"
  instructions: string
  image?: string
  prompt: string
  inputType: "button" | "dropdown" | "text"
  options?: string[]
  correctAnswer?: string | string[]
  onSuccessMessage?: string
  onWrongMessage?: string
}

export interface UpdateBubbleProps {
  user_id: string // interaction.user.tag
  competition_title: string // competition.name
  snowflake: string // interaction.id
}

export interface Season {
  [week: number]: Competition[]
}
