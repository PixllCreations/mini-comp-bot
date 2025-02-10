import type { Interaction } from "discord.js"
import type { UpdateBubbleProps } from "./interfaces"

export default async function updateBubble({
  interaction,
  competition_title,
}: UpdateBubbleProps) {
  const channel =
    interaction.channel && "name" in interaction.channel
      ? interaction.channel.name
      : "unknown"
  const server = interaction.guild?.name || "unknown"

  try {
    const response = await fetch(
      "https://thenotwork.org/version-test/api/1.1/obj/MINI_COMP_BOT_RESPONSES",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUBBLE_API_KEY}`,
        },
        body: JSON.stringify({
          user_id: interaction.user.id,
          poll_title: competition_title,
          snowflake: interaction.id,
          channel: channel,
          server: server,
        }),
      }
    )
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
