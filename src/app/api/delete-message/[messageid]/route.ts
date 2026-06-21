import {getServerSession} from "next-auth/next";
import {User} from "next-auth";
import {authOptions} from "@/src/app/api/auth/[...nextauth]/options";
import {prisma} from "@/src/lib/prisma";

export async function DELETE(req: Request, {params}: { params: Promise<{ messageid: string }> }) {
	const { messageid } = await params;
	const messageId = messageid;
	const session = await getServerSession(authOptions)
	const user: User = session?.user as User

	if (!session || !user || !user.id) {
		return Response.json(
			{
				success: false,
				message: 'Not Authenticated',
			},
			{status: 401},
		);
	}

	try {
		const deleteResult = await prisma.message.deleteMany({
				where: {
					id: messageId,
					userId: user.id
				}
			}
		)

		if (deleteResult.count === 0) {
			return Response.json(
				{message: 'Message not found or unauthorized', success: false},
				{status: 404}
			);
		}

		return Response.json(
			{message: 'Message deleted successfully', success: true},
			{status: 200}
		);
	} catch (error) {
		console.error('Error deleting message:', error);
		return Response.json(
			{message: 'Error deleting message', success: false},
			{status: 500}
		);
	}
}