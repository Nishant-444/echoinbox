import React from "react";
import { resend } from "../lib/resend";
import VerificationEmail from "@/emails/verificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendVerificationEmail(
	email: string,
	username: string,
	verifyCode: string,
): Promise<ApiResponse> {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
			|| (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

		const { data, error } = await resend.emails.send({
			from: "EchoInbox <noreply@mail.nishants.dev>",
			to: email,
			subject: "Verify your email - EchoInbox",
			react: React.createElement(VerificationEmail, { username, otp: verifyCode, baseUrl }),
		});

		if (error) {
			console.error("Resend API error:", error);
			return { success: false, message: error.message || "Failed to send verification email" };
		}

		return { success: true, message: "Verification email sent successfully" };
	} catch (emailError) {
		console.error("Error sending verification email", emailError);
		return { success: false, message: "Failed to send verification email" };
	}
}
