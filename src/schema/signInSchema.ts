import z from "zod";

// identifier is production grade term for signin field username/email
export const signInSchema = z.object({
	identifier: z.string().min(1, "Email or username is required"),
	password: z.string().min(1, "Password is required"),
});
