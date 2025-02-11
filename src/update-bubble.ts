import type { Interaction } from "discord.js"
import type { UpdateBubbleProps } from "./interfaces"
import fetch from "node-fetch"

interface ImgurResponse {
  success: boolean
  status: number
  data: {
    link: string
    error?: string
  }
}

async function uploadToImgur(imageUrl: string): Promise<string> {
  try {
    const imageResponse = await fetch(imageUrl, {
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    })

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text()
      throw new Error(
        `Failed to fetch image from Discord: ${imageResponse.statusText} - ${errorText}`
      )
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString("base64")

    if (!process.env.IMGUR_CLIENT_ID) {
      throw new Error("IMGUR_CLIENT_ID is not set in environment variables.")
    }

    const imgurResponse = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        image: base64Image,
        type: "base64",
      }).toString(),
    })

    const imgurData = (await imgurResponse.json()) as ImgurResponse

    if (!imgurResponse.ok || !imgurData.success) {
      throw new Error(`Imgur upload failed: ${JSON.stringify(imgurData)}`)
    }

    return imgurData.data.link
  } catch (error) {
    console.error("Imgur upload error:", error)
    throw error
  }
}

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
    let finalResponse = user_response
    if (competition.inputType === "image") {
      finalResponse = await uploadToImgur(user_response)
    }

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
        interaction_snowflake: interaction.id,
        discord_snowflake: interaction.user.id,
        text_response: competition.inputType !== "image" ? finalResponse : null,
        image_response: competition.inputType == "image" ? finalResponse : null,
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
