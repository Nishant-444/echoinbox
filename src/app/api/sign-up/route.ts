import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
	try {
		const { userName, email, password } = await req.json();
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
		const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ userName }, { email }],
			},
		});

		if (existingUser) {
			if (existingUser.isVerified) {
				return Response.json(
					{
						success: false,
						message: "User already exists with this email/username",
					},
					{ status: 400 },
				);
			} else {
				// update unverified user
				const hashedPassword = await bcrypt.hash(password, 10);
				const updatedUser = await prisma.user.update({
					where: { id: existingUser.id },
					data: {
						password: hashedPassword,
						verifyCode,
						verifyCodeExpiry: expiryDate,
					},
				});

				if (!updatedUser) {
					throw new Error(
						"Update failed: User record disappeared or database unreachable",
					);
				}
			}
		} else {
			// create new user
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = await prisma.user.create({
				data: {
					userName,
					email,
					password: hashedPassword,
					verifyCode,
					verifyCodeExpiry: expiryDate,
					isVerified: false,
					isAcceptingMessage: true,
				},
			});

			if (!newUser) {
				throw new Error("Failed to create user");
			}
		}
		const emailResponse = await sendVerificationEmail(
			email,
			userName,
			verifyCode,
		);

		if (!emailResponse.success) {
			return Response.json(
				{ success: false, message: emailResponse.message },
				{ status: 500 },
			);
		}
		return Response.json(
			{
				success: true,
				message: "User registered successfully. Please verify your email",
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error registering user", error);
		return Response.json(
			{
				success: false,
				message: "Error registering user",
			},
			{ status: 500 },
		);
	}
}
