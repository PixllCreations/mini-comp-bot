interface ResponseType {
  onSuccessMessage: string
  onWrongMessage: string
}

export function defaultBotResponse(
  response: keyof ResponseType,
  correctAnswer?: string | string[]
) {
  const defaultResponse: ResponseType = {
    onSuccessMessage: "✅ Nice work, you're crushing it! 🎉",
    onWrongMessage: `❌ Incorrect answer. The correct answer was: **${correctAnswer}**.`,
  }

  return defaultResponse[response]
}

// ----------------------------------------------------------------------------------------------------------------------------------

export const phishes = `
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

// ----------------------------------------------------------------------------------------------------------------------------------
