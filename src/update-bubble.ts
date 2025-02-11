import type { Interaction } from "discord.js"
import type { UpdateBubbleProps } from "./interfaces"

export default async function updateBubble({
  interaction,
  competition,
  user_response,
}: UpdateBubbleProps) {
  const channel =
    interaction.channel && "name" in interaction.channel
      ? interaction.channel.name
      : "unknown"
  const server = interaction.guild?.name || "unknown"

  try {
    const response = await fetch(process.env.BUBBLE_API_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BUBBLE_API_KEY}`,
      },
      body: JSON.stringify({
        channel: channel,
        competition_title: competition.name,
        competition_week: competition.week,
        server: server,
        snowflake: interaction.id,
        user_id: interaction.user.id,
        user_response: user_response,
      }),
    })
    const responseData = await response.json()

    if (!response.ok) {
      console.error("Bubble API Error:", response.status, responseData)
    } else {
      console.log("✅ Successfully posted to Bubble!")
    }
  } catch (error) {
    console.error("❌ Fetch error:", error)
  }
}
