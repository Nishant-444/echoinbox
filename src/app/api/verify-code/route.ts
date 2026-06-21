import { prisma } from '@/src/lib/prisma';
import { z } from 'zod';

const verifySchema = z.object({
  username: z.string().min(1, 'Username is required'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = verifySchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: 'Invalid input parameters',
          errors: z.flattenError(result.error).fieldErrors,
        },
        { status: 400 },
      );
    }

    const { username, code } = result.data;
    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
      where: { username: decodedUsername },
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: true, message: 'Account is already verified' },
        { status: 200 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verifyCode: '',
        },
      });

      return Response.json(
        { success: true, message: 'User verified successfully' },
        { status: 200 },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: 'Code expired. Please sign-up again.' },
        { status: 400 },
      );
    } else {
      return Response.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    console.error('Error verifying user:', error);
    return Response.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 },
    );
  }
}
