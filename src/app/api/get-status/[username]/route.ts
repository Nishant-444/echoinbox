import { prisma } from '@/src/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
      where: { username: decodedUsername },
      select: {
        isAcceptingMessage: true,
      },
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user status:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
