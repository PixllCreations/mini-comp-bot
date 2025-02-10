import type { Competition } from "../interfaces"
import { phishes, phishes_answers } from "./bot-response"

export const competitions: Competition[] = [
  {
    week: 1,
    category: "Cyber",
    name: "Sus or Trust",
    instructions: `Decide if the password is **TRUSTworthy** or **SUSworthy**. In other words, would you trust this password to protect your data or Nah?`,
    prompt: `2MuchFun!`,
    inputType: "button",
    options: ["Trust", "Sus"],
    correctAnswer: ["Sus"],
    onSuccessMessage:
      "🎉 You got it! `2MuchFun`! is a SUS-worthy password! If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
    onWrongMessage:
      "❌ Oops! `2MuchFun` isn't strong enough! It's actually pretty sus tbh. If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
  },
  {
    week: 1,
    category: "Digital Marketing",
    name: "Patent That pt.1",
    instructions: `Help us create a slogan.`,
    prompt:
      "MaRKeT reSEarCh suggests that many students struggle with ProRASstiNAtiOn. Stiegler EdTech has created a product that is sweeping the nation. This new product is called **NoCrastination**. We need your help to create a slogan for this product. Think about something catchy, memorable, an descriptive. The best slogan will be used in a post on the NØTWØRK!`",
    inputType: "text",
  },
  {
    week: 1,
    category: "Data Science",
    name: "Guess the Graph pt.1",
    instructions: `See if you can guess what this graph represents, select the option you think is best!`,
    image:
      "https://raw.githubusercontent.com/Stiegler-EdTech/mini-comp-bot/refs/heads/main/images/Dogs_vs_Cats.webp?token=GHSAT0AAAAAACZ4OUHJ2NODAU7U5CC4J6KAZ5KGWAQ",
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
  {
    week: 2,
    category: "Cyber",
    name: "Sneakin or Tweakin",
    instructions: `Identify the number of weaknesses in the given password.`,
    prompt: `Example123`,
    inputType: "button",
    options: ["1", "2", "3", "4"],
    correctAnswer: ["4"],
    onSuccessMessage:
      "🎉 You got it! `Example123` has 4 weaknesses! It is too short, the letters used form a simple word, the numbers are in a stereotypical order, and there are no special characters. If you're intersted in practicing your evaluation skills some more, try sending this command to the chat: `/sneakin-or-tweakin`",
    onWrongMessage:
      "❌ Oops! That is incorrect. `Example123` has 4 weaknesses! It is too short, the letters used form a simple word, the numbers are in a stereotypical order, and there are no special characters. If you want to test your password evaluation skills some more, try sending this command to the chat: /sus-or-trust",
  },
  {
    week: 2,
    category: "Digital Marketing",
    name: "Patent That pt.2",
    instructions: `Create an ad for Stiegler EdTech's latest product: **NoCrastination**. This product is on a tear, helping students stop procrastinating. We need to launch an ad that will stirr up some buzz. How better to do that than with a mysterious ad!? The best ad will be posted on the NØTWØRK!`,
    prompt: `Ideate a sentence or two that will could be posted as an advertiement. However, the finalized ad must be written ENTIRELY in emojis. Consider writing out your ad in words first and then using emojis to capture the sentiment of each phrase!`,
    inputType: "text",
  },
  {
    week: 2,
    category: "Data Science",
    name: "Guess the Graph pt.2",
    instructions: `Predict what the chart represents`,
    image: "", // TODO: grabt he raw URL from Github and add it here
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
  {
    week: 3,
    category: "Cyber",
    name: "Phind the Phish 🎣🎣",
    instructions: `Identify which emails are potential phishing attempts.`,
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
    onSuccessMessage: `🎉 You got it! The second and third emails are PHISHes. \n\n${phishes_answers}`,
    onWrongMessage: `❌ Oh no, you got PHISHed 😳🎣🎣😱!! The second and third emails are the PHISHes. \n\n${phishes_answers}`,
  },
  {
    week: 3,
    category: "Digital Marketing",
    name: "Patent That pt.3",
    instructions: `Stigler's marketing team is brainstorming caption ideas for a social media post. Help them out by filling in the blank! The best caption will be used in the post on the NØTWØRK!`,
    image: "", // TODO: grab the raw URL from Github and add it here
    prompt: `Write a caption for a post, advertising our latest product: **NoCrastination**.`,
    inputType: "text",
  },
  {
    week: 3,
    category: "Data Science",
    name: "Graph the Trend",
    instructions: `Predict the next data points on a trend graph.`,
    prompt: `Predict the next data points.`,
    inputType: "dropdown",
    options: ["10%", "15%", "20%"],
    correctAnswer: ["15%"],
  },
  {
    week: 4,
    category: "Cyber",
    name: "Caesar Cipher",
    instructions: `Decrypt a message using the Caesar Cypher. The Caesar cypher encodes messages by shifting each letter foreward 7 letter; they wrap around at the end. For example A = H, X = D. **Be sure to use ONLY lowercase letters:**`,
    prompt: `mhza ylmslelz dpu nhtlz`,
    inputType: "text",
    correctAnswer: ["fast reflexes win games"],
  },
  {
    week: 4,
    category: "Digital Marketing",
    name: "Patent That pt.4",
    instructions: `Help the marketing team come up with a clever meme to post in support of our latest product **NoCrastination**.`,
    image: "", // TODO: grab the raw URL from Github and add it here
    prompt: `Complete the text for this meme.`,
    inputType: "text",
  },
  {
    week: 4,
    category: "Data Science",
    name: "Graph the Facts",
    instructions: `Analyze the trend in a given graph.`,
    prompt: `What does this graph tell you about the trend?`,
    inputType: "text",
  },
  {
    week: 5,
    category: "Cyber",
    name: "Atbash Cipher",
    instructions: `Decrypt a this message using the Atbash (Substitution) Cypher key. Use the image below as a guide. To decode the message, you'll need to flip the alphabet and transpose the letters onto the encrypted message. **Be sure to use ONLY lowercase letters:**`,
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
    instructions: `Help the marketing team come up with a clever meme to post in support of our latest product **NoCrastination**.`,
    image: "", // TODO: grab the raw URL from Github and add it here
    prompt: `Fill in the blanks for this meme by clicking the butotn below and filling in the input.`,
    inputType: "text",
  },
  {
    week: 5,
    category: "Data Science",
    name: "Graph the Facts (Part 2)",
    instructions: `Analyze a second trend graph and explain it.`,
    prompt: `What does this graph tell you about the trend?`,
    inputType: "text",
  },
]

// export const competitions: Competition[] = [
//   {
//     name: "Sus or Trust",
//     week: 1,
//     category: "Cyber",
//     instructions: "Decide if the password is strong or weak.",
//     prompt: "P@ssw0rd123",
//     inputType: "button",
//     options: ["Trust", "Sus"],
//     correctAnswer: "Sus",
//     onSuccessMessage: "🎉 You got it! P@ssw0rd123 is a TRUST-worthy password!",
//     onWrongMessage: "❌ Oops! That password isn't strong enough!",
//   },
//   {
//     name: "Guess the Graph",
//     week: 1,
//     category: "Data Science",
//     instructions: "Identify what the graph represents.",
//     image:
//       "https://static01.nyt.com/images/2023/02/09/learning/LebronGraphLN2/LebronGraphLN2-superJumbo.png?quality=75&auto=webp",
//     prompt: "What does this graph represent?",
//     inputType: "dropdown",
//     options: ["Stock Prices", "Population Growth", "Temperature Trends"],
//     correctAnswer: "Stock Prices",
//   },
//   {
//     name: "Patent That Pt.1",
//     week: 1,
//     category: "Digital Marketing",
//     instructions: "Create a slogan for a fake product.",
//     prompt:
//       "Market research suggests that students struggle with procrastination. Create a slogan for a product that solves this.",
//     inputType: "text",
//     correctAnswer: "Hello World",
//   },
// ]
