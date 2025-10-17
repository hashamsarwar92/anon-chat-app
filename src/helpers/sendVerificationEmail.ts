import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "../lib/resend";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Anon Chat App | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    if (error) {
      console.error("Error from Resend API:", error);
      return { success: false, message: "Failed to send verification email" };
    }

    // ✅ FIXED: set success to true
    return { success: true, message: "Verification email sent successfully" };

  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
