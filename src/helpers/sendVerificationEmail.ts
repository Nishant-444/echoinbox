import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	userName: string,
	verifyCode: string,
): Promise<ApiResponse> {
	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
			subject: "EchoInbox | Verification Code",
			react: VerificationEmail({ userName, otp: verifyCode }),
		});

		return { success: true, message: "Verification email send successfully" };
	} catch (emailError) {
		console.error("Error sending verification email", emailError);
		return { success: false, message: "Failed to send verification email" };
	}
}
