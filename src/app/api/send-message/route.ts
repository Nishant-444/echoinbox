import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';

const sendMessageSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(400, 'Message exceeds maximum length'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = sendMessageSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: 'Invalid input',
          errors: z.flattenError(result.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userName, content } = result.data;

    const targetUser = await prisma.user.findFirst({
      where: { userName: userName },
      select: {
        id: true,
        isAcceptingMessage: true,
      },
    });

    if (!targetUser) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    if (!targetUser.isAcceptingMessage) {
      return Response.json(
        { success: false, message: 'User is not accepting messages right now' },
        { status: 403 },
      );
    }

    await prisma.message.create({
      data: {
        content,
        userId: targetUser.id,
      },
    });

    return Response.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('Error adding message:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
