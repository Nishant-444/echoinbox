import { Message } from "../generated/prisma/client";

export interface ApiResponse {
	success: boolean;
	message: string;
	isAcceptingMessages?: boolean;
	messages?: Array<Message>;
}
