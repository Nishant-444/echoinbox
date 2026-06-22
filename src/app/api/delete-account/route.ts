import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { prisma } from '@/src/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Explicitly run as a transaction to guarantee deletion order
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return Response.json(
      { success: true, message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting account:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
