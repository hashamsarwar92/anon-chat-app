import { fa } from "zod/locales";
import VerificationEmail from "../../emails/VerificationEmail";

import { resend } from "../lib/resend";
import { ApiResponse } from "../types/ApiResponse";


export async function sendVerificationEmail(username: string, email: string, verifyCode: string): Promise<ApiResponse> {
    try{
        const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Anon Chat App | Verification Code',
    react: VerificationEmail({username, otp: verifyCode}),
  });
return {success: false, message: "verification email send succesfully"}
    }catch(emailError){
        console.error("Error sending verificsation email", emailError)
        return {success: false, message: "Failed to send verification email"}
    }
}