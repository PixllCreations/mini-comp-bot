import type { UpdateBubbleProps } from "./interfaces"

export default async function updateBubble({
  user_id,
  competition_title,
  snowflake,
}: UpdateBubbleProps) {
  try {
    const response = await fetch(
      "https://thenotwork.org/version-test/api/1.1/obj/DISCORD_POLL_RESPONSES",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUBBLE_API_KEY}`,
        },
        body: JSON.stringify({
          user_id: user_id,
          poll_title: competition_title,
          snowflake: snowflake,
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
