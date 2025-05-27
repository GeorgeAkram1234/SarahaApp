import { EventEmitter } from "node:events";
import { confirmEmailTemplate } from "../email/template/confrimEmail.js";
import { sendEmail } from "../email/send.email.js";
import { generateToken } from "../security/token.js";

export const emailEvent = new EventEmitter()

emailEvent.on("sendConfirmEmail", async ({ email } = {}) => {
    const emailToken = generateToken({ payload: { email }, signature: process.env.EMAIL_TOKEN_SIGNATURE })
    const emailLink = `${process.env.FE_URL}/confirm-email/${emailToken}`
    const html = confirmEmailTemplate({ emailLink })
    await sendEmail({ to: email, subject: "ConfirmEmail", html })
})
