import type { Competition } from "../interfaces"
import { formatCompInstructions, phishes, phishesAnswers } from "./bot-response"

export const competitions: Competition[] = [
  // WEEK 1
  {
    week: 1,
    category: "Cybersecurity",
    name: "Sus or Trust",
    instructions: formatCompInstructions(
      1,
      "cybersecurity",
      "Decide if the password is **TRUSTworthy** or **SUSworthy**. In other words, would you trust this password to protect your data or Nah?"
    ),
    prompt: `**Password:** 2MuchFun!`,
    inputType: "button",
    options: ["Trust", "Sus"],
    correctAnswer: ["Sus"],
    onSuccessMessage: "🎉 You got it! `2MuchFun`! is a SUS-worthy password! ", // If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
    onWrongMessage:
      "❌ Oops! `2MuchFun` isn't strong enough! It's actually pretty sus tbh.", // If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
  },
  {
    week: 1,
    category: "Digital Marketing",
    name: "Patent That pt.1",
    instructions: formatCompInstructions(
      1,
      "digitalMarketing",
      "Create an ad for Stiegler EdTech's latest product: **NoCrastination**. This product is on a tear, helping students stop procrastinating. We need to launch an ad that will stirr up some buzz. How better to do that than with a mysterious ad!? The best ad will be posted on the NØTWØRK!"
    ),
    prompt: `Ideate a sentence or two that will could be posted as an advertiement. However, the finalized ad must be written ENTIRELY in emojis. Consider writing out your ad in words first and then using emojis to capture the sentiment of each phrase!`,
    inputType: "text",
  },
  {
    week: 1,
    category: "Data Science",
    name: "Guess the Graph pt.1",
    instructions: formatCompInstructions(
      1,
      "dataScience",
      "Observe the progression on the graph. See if you can guess what is being represented here, select the option you think is best!"
    ),

    image:
      "https://raw.githubusercontent.com/Stiegler-EdTech/mini-comp-bot/refs/heads/main/images/Dogs_vs_Cats.webp",
    prompt: ``,
    inputType: "dropdown",
    options: [
      "How long each pet likes to hang out with you",
      "How long people like to hang out with each pet",
      "How much each pet misses you based on how long you're away",
      "Level of overall chillness",
    ],
    correctAnswer: [
      "How much each pet misses you based on how long you're away",
    ],
  },
  // WEEK 2
  {
    week: 2,
    category: "Cybersecurity",
    name: "Sneakin or Tweakin",
    instructions: formatCompInstructions(
      2,
      "cybersecurity",
      "Identify the number of weaknesses in the given password"
    ),
    prompt: `**Password:** Example123`,
    inputType: "button",
    options: ["1", "2", "3", "4"],
    correctAnswer: ["4"],
    onSuccessMessage:
      "🎉 You got it! `Example123` has 4 weaknesses! It is too short, the letters used form a simple word, the numbers are in a stereotypical order, and there are no special characters.", // If you're intersted in practicing your evaluation skills some more, try sending this command to the chat: `/sneakin-or-tweakin`",
    onWrongMessage:
      "❌ Oops! That is incorrect. `Example123` has 4 weaknesses! It is too short, the letters used form a simple word, the numbers are in a stereotypical order, and there are no special characters.", // If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
  },
  {
    week: 2,
    category: "Digital Marketing",
    name: "Patent That pt.2",
    instructions: formatCompInstructions(
      2,
      "digitalMarketing",
      "MaRKeT reSEarCh suggests that many students struggle with ProRASstiNAtiOn. Stiegler EdTech has created a product that is sweeping the nation. This new product is called **NoCrastination**. We need your help to create a logo for this product. Think about something that is fun, memorable, and descriptive of the product idea. The best logo will be used in a post on the NØTWØRK!${newLines}Try using tools like Leonardo.ai or Canva to generate images or build custom designs. Draw some inspiration from the logo shown below."
    ),
    image:
      "https://github.com/Stiegler-EdTech/mini-comp-bot/blob/main/images/NoCrastinationLogo.jpeg?raw=true",
    prompt: "",
    inputType: "image",
  },
  {
    week: 2,
    category: "Data Science",
    name: "Guess the Graph pt.2",
    instructions: formatCompInstructions(
      2,
      "dataScience",
      "Observe the progression on the graph. See if you can guess what is being represented here!"
    ),

    image:
      "https://raw.githubusercontent.com/Stiegler-EdTech/mini-comp-bot/refs/heads/main/images/TV_Consumption.webp",
    prompt: ``,
    inputType: "dropdown",
    options: [
      "Time spent looking for something to watch vs. actually watching something",
      "Amount of sugar in a Pixy Stix vs protein",
      "Ratio or People to Penguins in Alaska",
      "Ratio of people who prefer dogs to cats",
    ],
    correctAnswer: [
      "Time spent looking for something to watch vs. actually watching something",
    ],
  },
  // WEEK 3
  {
    week: 3,
    category: "Cybersecurity",
    name: "Phind the Phish 🎣🎣",
    instructions: formatCompInstructions(
      3,
      "cybersecurity",
      "Identify which emails are potential phishing attempts."
    ),
    prompt: phishes,
    inputType: "dropdown",
    options: [
      "A bunch of Phishes",
      "All Safe",
      "Safe, Phish, Phish",
      "Safe, Safe, Phish",
      "Phish, Safe, Safe",
    ],
    correctAnswer: ["Safe, Phish, Phish"],
    onSuccessMessage: `🎉 You got it! The second and third emails are PHISHes. \n\n${phishesAnswers}`,
    onWrongMessage: `❌ Oh no, you got PHISHed 😳🎣🎣😱!! The second and third emails are the PHISHes. \n\n${phishesAnswers}`,
  },
  {
    week: 3,
    category: "Digital Marketing",
    name: "Patent That pt.3",
    instructions: formatCompInstructions(
      3,
      "digitalMarketing",
      "Stigler's marketing team is brainstorming caption ideas for a social media post. Help them out by filling in the blank! The best caption will be used in the post on the NØTWØRK!"
    ),
    image:
      "https://github.com/Stiegler-EdTech/mini-comp-bot/blob/main/images/NoCrastination_SM_Post.jpeg?raw=true",
    prompt: `Write a caption for a post, advertising our latest product: **NoCrastination**.`,
    inputType: "text",
  },
  {
    week: 3,
    category: "Data Science",
    name: "Graph the Trend",
    instructions: formatCompInstructions(
      3,
      "dataScience",
      "Predict the next data points on a trend graph."
    ),
    prompt: `Predict the next data points.`,
    inputType: "dropdown",
    options: ["10%", "15%", "20%"],
    correctAnswer: ["15%"],
  },
  // WEEK 4
  {
    week: 4,
    category: "Cybersecurity",
    name: "Caesar Cipher",
    instructions: formatCompInstructions(
      4,
      "cybersecurity",
      "Decrypt a message using the Caesar Cypher. The Caesar cypher encodes messages by shifting each letter foreward 7 letter; they wrap around at the end. For example A = H, X = D. **Be sure to use ONLY lowercase letters:**"
    ),
    prompt: `mhza ylmslelz dpu nhtlz`,
    inputType: "text",
    correctAnswer: ["fast reflexes win games"],
  },
  {
    week: 4,
    category: "Digital Marketing",
    name: "Patent That pt.4",
    instructions: formatCompInstructions(
      4,
      "digitalMarketing",
      "Help the marketing team come up with a clever meme to post in support of our latest product **NoCrastination**."
    ),
    image:
      "https://raw.githubusercontent.com/Stiegler-EdTech/mini-comp-bot/refs/heads/main/images/NoCrastination_meme_1.webp",
    prompt: `Complete the text for this meme.`,
    inputType: "text",
  },
  {
    week: 4,
    category: "Data Science",
    name: "Graph the Facts",
    instructions: formatCompInstructions(
      4,
      "dataScience",
      "Guess the trend in the provide graph."
    ),
    prompt: `What does this graph tell you about the trend?`,
    inputType: "text",
  },
  // WEEK 5
  {
    week: 5,
    category: "Cybersecurity",
    name: "Atbash Cipher",
    instructions: formatCompInstructions(
      5,
      "cybersecurity",
      "Decrypt a this message using the Atbash (Substitution) Cypher key. Use the image below as a guide. To decode the message, you'll need to flip the alphabet and transpose the letters onto the encrypted message. **Be sure to use ONLY lowercase letters:**"
    ),
    image:
      "https://www.wikihow.com/images/thumb/b/b9/Create-Substitution-Ciphers-Step-3.jpg/aid309898-v4-728px-Create-Substitution-Ciphers-Step-3.jpg",
    prompt: `xsznkrlmh dlip zh z gvzn`,
    inputType: "text",
    correctAnswer: ["champions work as a team"],
  },
  {
    week: 5,
    category: "Digital Marketing",
    name: "Patent That pt.5",
    instructions: formatCompInstructions(
      5,
      "digitalMarketing",
      "Help the marketing team come up with a clever meme to post in support of our latest product **NoCrastination**."
    ),
    image:
      "https://raw.githubusercontent.com/Stiegler-EdTech/mini-comp-bot/refs/heads/main/images/NoCrastination_meme_2.webp",
    prompt: `Fill in the blanks for this meme by clicking the butotn below and filling in the input.`,
    inputType: "text",
  },
  {
    week: 5,
    category: "Data Science",
    name: "Graph the Facts (Part 2)",
    instructions: formatCompInstructions(
      5,
      "dataScience",
      "Analyze this trend graph and explain it."
    ),
    prompt: `What does this graph tell you about the trend?`,
    inputType: "text",
  },
  // WEEK 6
]
