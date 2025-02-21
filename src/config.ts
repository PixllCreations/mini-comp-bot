import dotenv from "dotenv"
dotenv.config()

export const CLIENT_ID = process.env.CLIENT_ID!
export const GUILD_ID = process.env.GUILD_ID!
export const BOT_TOKEN = process.env.BOT_TOKEN || ""
