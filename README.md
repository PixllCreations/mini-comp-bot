# STEM Mini Challenge Bot!

The goal of this bot is to send predefined STEM Mini competition to select Discord channels. Each competition will consist of one question that is answerable in the following format: button, dropdown, text input. Something to be aware of is the nearly synonymous language of **`challenge`** and **`competition`**. The user facing terms now use **`challenge`** in place of what was **`competition`**. In the code, **`competition`** is the same as a **`challenge`**. The modification to the terms was made after the bot was finished development and so functions, variables, interfaces, etc. will still use the **`competition`** terminology even though they are referring to **`challenges`**.

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

## Running the Bot

This bot is currently hosted on **Railway** under the project name **"mini-challenge-bot"**. It runs using the **bun** package manager.

### Running the Bot Locally
To run the bot locally, pull the project repository
> `bun install`
> 
> `bun run dev`

### Command Management
This Discord bot operates using slash commands, which are:
-   Defined in individual files under `src/commands/`. If you add new commands, follow the naming convention of the file name being the command's name. (ex: `/minibatch` -> `mini-batch.ts`)
-   Registered with Discord in `src/register-commands.ts`.

If you modify any command files or `register-commands.ts`, you must re-register the commands:
> `bun run src/register-commands.ts`

If running locally, restart the bot after registering commands. You shouldn't need to manually run the register command since that is included in the `dev` script. Just be aware that this registration needs to happen.

### Deploying Updates
Railway automatically redeploys the bot when updates are pushed to the main branch, so you should not need to worry about manually registering new commands in production. However, if newly created or modified commands do not appear in Discord or do not function as expected, verify they have been properly registered.

## Build the Season's Challenges (formerly "Competitions")

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

In order to set the competitions for a given period of time, you will assemble an array of type `Competition[]` where each object is a respective competition

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

The function `formatCompInstructions(...//)` is used to ensure consistent formatting of all mini comp headers. You do not have to use this but unless you want to create a specific header, make the modifications inside the aforementioned function directly, since that will be applied to all header from then on out.

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
If your mini challenge has a correct answer, make sure to include the `correctAnswer` key in your competition object. This is what the student's asnwers will be compared against.

## Using the Bot

To use the bot you will send the following command in the channel you wish to send the mini comp to (a single command to send to multiple channels is coming soon). Run the following command:

    /start {week #} {competition type}

> {week #} = Competition.week
>
> {competition type} = Competition.category

example: `/minibatch 1 Cybersecurity`

## Collecting responses

ALL response by students with the mini comps will be captured and POSTed to the Bubble DB. Currently there is a Data Type named `MINI_COMP_BOT_RESPONSES`, it is updated from `/src/udpate-bubble.ts`. At the moment the data collected from the students is the following:


```
{
  server
  channel
  competition_title
  competition_week
  interaction_snowflake // id student's interaction
  discord_snowflake // student's discord ID
  text_response // if student responds using buttons, text input, dropdown
  image_response // if the student responds with an image
}

```
