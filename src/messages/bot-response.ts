import type { CompHeadings } from "../interfaces"

interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Default success and failure messages when students answer

function defaultBotResponse(
  response: keyof ResponseType,
  correctAnswer?: string | string[]
) {
  const defaultResponse: ResponseType = {
    onSuccessMessage: "✅ Nice work, you're crushing it! 🎉",
    onWrongMessage: `❌ Sorry, that is incorrect. The correct answer was: **${correctAnswer}**.`,
  }

  return defaultResponse[response]
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Success message sent to admin after mini comp launch

function adminLaunchResponse(
  week: number,
  competition: string,
  numChannels: number
) {
  let heading = ""
  switch (competition) {
    case "Cybersecurity":
      heading = "cybersecurity"
      break
    case "Digital Marketing":
      heading = "digitalMarketing"
      break
    case "Data Science":
      heading = "dataScience"
      break
  }

  return `# [Launched] ${
    compHeadings[heading as keyof typeof compHeadings]
  }\nMini Comp [Week ${week}] :rocket:launched in **${numChannels}** channels`
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Initial message sent to students to introduce and explain the mini comp

const compHeadings: CompHeadings = {
  cybersecurity: "Cybersecurity 💻🔐👾",
  digitalMarketing: "Digital Marketing :selfie:🎆📢",
  dataScience: "Data Science 📊📉🔍",
}

const newLines = "\n\u200B\n"

function formatCompInstructions(
  week: number,
  category: keyof CompHeadings,
  instructions: string
) {
  return `# [🏆Mini Comps: Week ${week}] ${compHeadings[category]}${newLines}${instructions}`
}

// ----------------------------------------------------------------------------------------------------------------------------------
// Phishing emails and answers with Markdown

const phishes = `
### 📧 Email 1:
**Subject:** Important: School Account Password Expiration Notice  
**From:** IT Support \`<itsupport@school.edu>\`  
**To:** Student  

Dear Rick Steves,  

This is a courtesy reminder that your school email password is set to expire in 5 days. To avoid any disruption in accessing your account, please update your password by visiting our official **School IT Portal**.  

🔒 **Update your password here:** [school.edu/password-reset](https://school.edu/password-reset)  

If you have any questions or need assistance, please contact the IT Help Desk at **helpdesk@school.edu** or visit Room 203 in the main building.  

Thank you,  
**IT Support Team**  
[School Name]  

---

### 🚨 Email 2:
**Subject:** ⚠️ Urgent: Your Account Has Been Compromised!  
**From:** IT Security \`<security@school-secure.com>\`  
**To:** Student  

Dear Student,  

We have detected **suspicious activity** on your school account. Someone attempted to log in from an unknown location. For your security, we have temporarily locked your account. To restore access, you must verify your identity immediately:  

🔑 **[Click here to verify](https://fake-school-security.com/login)**  

Failure to verify your account within **24 hours** will result in **permanent deactivation**.  

Thank you,  
**School Security Team**  

---

### 🎓 Email 3:
**Subject:** 🎓 Congratulations! You’ve Been Selected for a $1,000 Scholarship  
**From:** Scholarship Office \`<scholarships@studentscholarships.org>\`  
**To:** Student  

Dear [Student Name],  

Congratulations! You have been selected for a **$1,000 scholarship** from the National Student Fund. To claim your award, please fill out the verification form below:  

📋 **[Claim your scholarship now](https://student-award-portal.com)**  

You must submit your details **before midnight tonight** to confirm your eligibility. Don’t miss this **exclusive opportunity**!  

Best regards,  
**National Student Fund Team**  

---
`

const phishesAnswers = `### 📧 Email 1: **Legitimate Email ✅**
A real **password expiration notice** from the school IT department.  
- **Key Features:** Uses a school-affiliated email (\`@school.edu\`), provides a **legitimate** password reset link, and offers **IT support contact options**.  
- **No urgency or threats.**  

---

### 🚨 Email 2: **Phishing Email (Fake Security Alert) ❌**
A **scam** pretending to be from IT Security, claiming your account has been "compromised."  
- **Red Flags:** Uses **fear tactics**, a **fake deadline** (24 hours), and an **incorrect sender email** (\`@school-secure.com\`).  
- **Goal:** Trick you into clicking a fake **login verification link** to steal credentials.  

---

### 🎓 Email 3: **Phishing Email (Fake Scholarship Offer) ❌**
A **scam** pretending to offer a $1,000 scholarship.  
- **Red Flags:** Too-good-to-be-true offer, **urgency tactic** ("before midnight tonight"), and a **non-school email domain**.  
- **Goal:** Collect personal info via a fake "scholarship claim" link.  

---

### 🔍 **How to Spot Phishing Emails**
- **Check the sender’s email:** Does it match the official domain?  
- **Look for urgency tactics:** Phishers try to rush you into acting.  
- **Verify links:** Hover over links before clicking to see the real URL.`

// ----------------------------------------------------------------------------------------------------------------------------------

export {
  phishesAnswers,
  phishes,
  adminLaunchResponse,
  defaultBotResponse,
  formatCompInstructions,
}
