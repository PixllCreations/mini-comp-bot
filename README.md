# STEM Mini Comp Bot!

The goal of this bot is to send predefined STEM Mini competition to select Discord channels. Each competition will consist of one question that is answerable in the following format: button, dropdown, text input. Something to be aware of is the nearly synonymous language of "challenge" and "competition". The user facing terms now use "challenge" in place of what was "competition". In the code, "competition" is the same as a "challenge". The modification to the terms was made after the bot was finished development and so functions, variables, interfaces, etc. will still use the "competition" terminology even though they are referring to "challenges".

# How to Use!

Follow these instructions to set up the discord bot (the permissions should be fine for now, but feel free to update things as needed).

## Permissions

The bot is currently restricted to **admin role only** in Discord. To modify this, update the `.env` file:
- Set `PERMITTED_ROLE` to the **role ID** of the desired role (only one may be used).

## Including the Bot

### Channel
To allow the bot to function in specific channels, follow these steps:
- Add the **channel ID(s)** to `TARGET_CHANNELS` in the `.env` file.
- To both **Members** and **Roles**, add **Poller**

### Server
To deploy the bot in a new server, update the `.env` file:
- Set `GUILD_ID` to the **server ID**.
the bot is currently set up to handle ONLY ONE server. You may add as many channels under the same server as you want, but you may only include one server.

🚨 **IMPORTANT** 🚨  
For the bot to send or receive **any messages**, you **must** define:
- **one `GUILD_ID`**.
- At least **one value for `TARGET_CHANNELS`**.


## Build the Season's Competitions (now "Challenges")

To prepare a mini challenge, use the interface below to define the object. This is currently the only way to add/update/delete challenges for the season. 

```
type Category = "Cybersecurity" | "Digital Marketing" | "Data Science"

type InputType = "button" | "dropdown" | "text" | "image"

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
```

In order to set a season's worth of mini challenges, you must assemble an array of type `Competition[]` where each object is a respective competition. This is the object that will be referenced when a user calls one of the two slash commands (mentioned below in the section titled "**Using the Bot**").

```
const  competitions:  Competition[] = [
	{
		name:  "Sus or Trust",
		week:  1,
		category:  "Cyber",
		instructions: formatCompInstructions(
      		1,
      		"cybersecurity",
      		"Decide if the password is **TRUSTworthy** or **SUSworthy**. In other words, would you trust this password to protect your data or Nah?"
    	),
		prompt:  "**Password:** P@ssw0rd123",
		inputType:  "button",
		options: ["Trust", "Sus"],
		correctAnswer:  "Sus",
		onSuccessMessage:  "🎉 You got it! P@ssw0rd123 is a TRUST-worthy password!",
		onWrongMessage:  "❌ Oops! That password isn't strong enough!",
	},
	{
		name:  "Build a Logo",
		week:  1,
		category:  "Digital Marketing",
		instructions: formatCompInstructions(
      		1,
      		"digitalMarketing",
      		"Create a logo for our company's new brand Fuhll Stahch"
    	),
		image:
		"https://static01.nyt.com/images/2023/02/09/learning/LebronGraphLN2/LebronGraphLN2-
		superJumbo.png?quality=75&auto=webp",
		inputType:  "image",
	},

	...//
]
```

### A few things to note:

All text that is to be displayed in a discord message, MAY be formatted using Markdown if you want. Include all of the styles in the strings and they will be rendered accordingly. Here is a helpful markdwon editor that I used: [boom, said markdown editor](https://stackedit.io/app#)

**Instructions for formatting instructions:**

The function `formatCompInstructions(...//)` is used to ensure consistent formatting of all mini challenge headers. If you need the challenge instructions to be formatted uniquely for a particular competition, you may leave out the aforementioned function and simply style the instructions how you want; just place that string as the value for the `instructions: string` key.

**Success/Failure messages**

The `copmetition.on_____Message:` keys are optional. There are currently two default messages that the bot will send if you do not include a custom response (`src/messages/bot-response.ts`):

> onSuccessMessage: "✅ Nice work, you're crushing it! 🎉"
> 
> onWrongMessage: `❌ Incorrect answer. The correct answer was: **${correctAnswer}**.`

The `Competition.options:` MUST be included if you choose either `button` or `dropdown` for the `Competition.inputType`. The bot will not work if that array is empty.

> "button" requires TWO options
> 
> "dropdown" requires AT LEAST ONE option

**Input Type:**
The `inputType` decides the type of response the user is asked to use. `Buttons` and `Dropdown` REQUIRE `options` since the students may only select from what is provided. `Text` and `Image` are open to how the student wants to respond.

**Correct Answer:**
If your mini comp has a correct answer, make sure to include the `correctAnswer` key in your competition object. This is what the student's asnwers will be compared against.

## Using the Bot

To use the bot you will send the following command in the channel you wish to send the mini comp to (a single command to send to multiple channels is coming soon). Run the following command:

    /start {week #} {competition type}

> {week #} = Competition.week
>
> {competition type} = Competition.category

## Collecting responses

ALL response by students with the mini comps will be captured and POSTed to the Bubble DB. Currently there is a Data Type named `MINI_COMP_BOT_RESPONSES`, it is updated from `/src/udpate-bubble.ts`. At the moment the data collected from the students is the following:


```
{
  channel
  competition_title
  competition_week
  server
  interaction_snowflake
  discord_snowflake
  text_response
  image_response
}

```

# poller-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

At any point, if you update/add anything in the `/commands` directory, run `bun start` again, as the updated commands MUST be registerred with Discord.
