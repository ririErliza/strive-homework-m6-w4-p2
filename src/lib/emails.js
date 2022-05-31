import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async recipientAddress => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Thanks for registering on the platform!",
    text: "bla bla bla",
    html: "<strong>bla bla bla</strong>",
  }

  await sgMail.send(msg)
}

export const sendBlogPostEmail = async author => {
  const msg = {
    to: author.email,
    from: process.env.SENDER_EMAIL,
    subject: `Congratulations ${author.name} your new post has been published on the platform!`,
    text: "bla bla bla",
    html: `<a href=${process.env.FE_URL}>To the platform!</a>`,
  }

  await sgMail.send(msg)
}
