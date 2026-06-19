import z from "zod";

// signle element to check so directly using its type
export const userNameValidation = z
	.string()
	.trim()
	.toLowerCase()
	.min(3, "Username must be atleast 3 characters")
	.max(30, "Username must be no more than characters")
	.regex(
		/^[a-z0-9_-]+$/,
		"Username can only contain letters, numbers, underscores, and hyphens",
	);

// multiple element to check so using an object
export const signUp = z.object({
	userName: userNameValidation,
	email: z.email({ message: "Invalid email address" }),
	password: z
		.string()
		.trim()
		.toLowerCase()
		.min(6, { message: "Password must be atleast 6 characters" })
		.max(32, { message: "Password must be atmost 32 characters" })
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[\W_]/, {
			message: "Password must contain at least one special character",
		}),
});
