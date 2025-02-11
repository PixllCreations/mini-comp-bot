# STEM Mini Comp Bot!

The goal of this bot is to send predefined STEM Mini competition to predefined Discord channels. Each competition will consist of one question that is answerable in the following format: button, dropdown, text input.

# How to Use!

Follow these instructions to set up the discord bot (the permissions should be fine for now, but feel free to update things as needed).

## Permissions

Currently the bot it is set to allow ONLY the admin role to use the it in Discord. To change this, modify the PERMITTED_ROLE in the .env

    Right click the respective server -> Server Settings -> Roles ->
    Right click the role you want to add -> Select
    "Copy Role ID" and use that to define the PERMITTED_ROLE

To add the bot to channels do the following:

    Select the channels you want the bot to send messages to. Go to channel Settings ->
    Overview -> Add members or roles -> add Poller to the Members and Poller to the Roles

    Then Add the channel Id to CHANNEL_ID in the .env

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

In order to set the competitions for a given period of time, you will assemble an array of type `Competition[]`

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
		name:  "Guess the Graph",
		week:  1,
		category:  "Data Science",
		instructions: "Identify what the graph represents.",
		image:
		"https://static01.nyt.com/images/2023/02/09/learning/LebronGraphLN2/LebronGraphLN2-
		superJumbo.png?quality=75&auto=webp",
		prompt:  "What does this graph represent?",
		inputType:  "dropdown",
		options: ["Stock Prices", "Population Growth", "Temperature Trends"],
		correctAnswer:  "Stock Prices",
	},

	...//
]
```

### A few things to note:

**Instructions formatting:**

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

## Use the Bot

To use the bot you will send the following command in the channel you wish to send the mini comp to (a single command to send to multiple channels is coming soon). Run the following command:

    /start {week #} {competition type}

> {week #} = Competition.week

> {competition type} = Competition.category

## Collecting responses

ALL response by students with the mini comps will be captured and POSTed to the Bubble DB. Currently there is a Data Type named `MINI_COMP_BOT_RESPONSES`, it is updated from `/src/udpate-bubble.ts`. At the moment the data collected from the students is ONLY their discord username, interaction id (snowflake), and competition name.

# poller-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/app.js
```

This project was created using `bun init` in bun v1.1.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
