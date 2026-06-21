import { Message } from "../generated/prisma/client";

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessage?: boolean;
	messages?: Array<Message>;
}
