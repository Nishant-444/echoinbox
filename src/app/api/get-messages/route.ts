import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/src/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    const userWithMessages = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!userWithMessages) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        messages: userWithMessages.messages,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
