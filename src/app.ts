import {
  Client,
  GatewayIntentBits,
  Collection,
  MessageFlags,
  DiscordAPIError,
} from "discord.js"
import type { Interaction } from "discord.js"
import { BOT_TOKEN } from "./config"
import { miniBatchCommand, startCommand } from "./commands/index"
import {
  onButtonInteraction,
  onModalSubmitInteraction,
  onStringSelectMenuInteraction,
} from "./interactions/index"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const commands = new Collection<string, any>()
commands.set(startCommand.data.name, startCommand)
commands.set(miniBatchCommand.data.name, miniBatchCommand)

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`)
})

client.on("interactionCreate", async (interaction: Interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = commands.get(interaction.commandName)
      if (!command) return

      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        await interaction.reply({
          content: "❌ There was an error executing this command!",
          flags: [MessageFlags.Ephemeral],
        })
      }
    } else if (interaction.isButton()) {
      // TODO: implement function from user-interaction.ts
      onButtonInteraction(interaction)
    } else if (interaction.isStringSelectMenu()) {
      onStringSelectMenuInteraction(interaction)
    } else if (interaction.isModalSubmit()) {
      onModalSubmitInteraction(interaction)
    }
  } catch (error) {
    console.error(
      `🚨Failed interaction ${interaction.id} from channel ${
        interaction.channel && "name" in interaction.channel
          ? interaction.channel.name
          : "unknown"
      }:\n`
    )
    if (error instanceof DiscordAPIError) {
      console.error(
        `\tDiscord API Error: ${error.message.replace(/\n/g, `\n\t`)}`
      )
    } else {
      console.error(`Error: ${error}`)
    }
  }
})

// Start the bot
client.login(BOT_TOKEN)
