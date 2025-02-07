import type { Competition, Season } from "../interfaces"

export const competitions: Competition[] = [
  {
    name: "Sus or Trust",
    week: 1,
    category: "Cyber",
    instructions: "Decide if the password is strong or weak.",
    prompt: "P@ssw0rd123",
    inputType: "button",
    options: ["Trust", "Sus"],
    correctAnswer: "Sus",
    onSuccessMessage: "🎉 You got it! P@ssw0rd123 is a TRUST-worthy password!",
    onWrongMessage: "❌ Oops! That password isn't strong enough!",
  },
  {
    name: "Guess the Graph",
    week: 1,
    category: "Data Science",
    instructions: "Identify what the graph represents.",
    image:
      "https://static01.nyt.com/images/2023/02/09/learning/LebronGraphLN2/LebronGraphLN2-superJumbo.png?quality=75&auto=webp",
    prompt: "What does this graph represent?",
    inputType: "dropdown",
    options: ["Stock Prices", "Population Growth", "Temperature Trends"],
    correctAnswer: "Stock Prices",
  },
  {
    name: "Patent That Pt.1",
    week: 1,
    category: "Digital Marketing",
    instructions: "Create a slogan for a fake product.",
    prompt:
      "Market research suggests that students struggle with procrastination. Create a slogan for a product that solves this.",
    inputType: "text",
    correctAnswer: "Hello World",
  },
]

export const season: Season = {
  1: competitions,
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
}
