import { prisma } from '@/src/lib/prisma';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 },
    );
  }

  const userId = user.id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAcceptingMessage: acceptMessages },
    });

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User status updated successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Failed to update user status to accept messages');
    return Response.json(
      {
        success: false,
        message: 'Failed to update user status to accept messages',
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 },
    );
  }

  const userId = user.id;

  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log('Failed to fetch user status to accept messages', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to fetch user status to accept messages',
      },
      { status: 500 },
    );
  }
}
