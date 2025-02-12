# STEM Mini Comp Bot!

The goal of this bot is to send predefined STEM Mini competition to predefined Discord channels. Each competition will consist of one question that is answerable in the following format: button, dropdown, text input.

# How to Use!

Follow these instructions to set up the discord bot (the permissions should be fine for now, but feel free to update things as needed).

## Permissions

Currently the bot it is set to allow ONLY the admin role to use the it in Discord. To change this, modify the PERMITTED_ROLE in the .env by pasting the ROLE ID of the desired role in Discord

To add the bot to channels do the following:
add Poller to the Members and Poller to the Roles
Then Add the channel Ids to CHANNEL_ID in the .env

To add the bot to a new server, simply update the GUILD_ID in the .env

## Build the Season's Competitions

To prepare a season's worth of mini comps, you will need to create an object adhering to the interface defined below.

```
// path: src/interface.ts

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

In order to set the competitions for a given period of time, you will assemble an array of type `Competition[]` where each object is the respective competition

```
// path: src//messages/competitions.ts

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

All text that is to be displayed as a discord message, MAY be formatted using Markdown if you want. Include all of the styles in the strings and they will be rendered accordingly. Here is a helpful markdwon editor that I used: [boom, said markdown editor](https://stackedit.io/app#)

**Instructions for formatting messages:**

The function `formatCompInstructions(...//)` is used to ensure consistent formatting of all mini comp headers. You do not have to use this but unless you want to create a specific header, make the modifications inside the aforementioned function directly, since that will be applied to all header from then on out. Currently, the format will look like this:

> ## [🏆Mini Comps: Week 1] Digital Marketing :selfie::fireworks::loudspeaker:
>
> MaRKeT reSEarCh suggests that many students struggle with ProRASstiNAtiOn. Stiegler EdTech has created a product that is sweeping the nation. This new product is called **NoCrastination**. We need your help to create a logo for this product.

**Succcess/Failure messages**

The `Copmetition.on_____Message:` keys are optional. There are two default messages that the bot will send if you do not include a custom response:

> onSuccessMessage: "✅ Nice work, you're crushing it! 🎉",

> onWrongMessage: `❌ Incorrect answer. The correct answer was: **${correctAnswer}**.`

The `Competition.options:` MUST be included if you choose either `button` or `dropdown` for the `Competition.inputType`. The bot will not work if that array is empty.

> button requires TWO options

> dropdown requires AT LEAST ONE option

**Input Type:**
The `inputType` governs the kind of response the user is permitted to send. Buttons and Dropdown REQUIRE `options` since the studnets may only select from what you provide. Text and Image are open to how the student wants to respond.

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

```discord username
interaction id
interaction id (or snowflake)
competition name
student response (image or text)
channel (the channel where the student responded from)
server (the server in which the compeition was run)
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
