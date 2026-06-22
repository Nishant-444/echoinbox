import { prisma } from '@/src/lib/prisma';
import { usernameValidation } from '@/src/schema/signUpSchema';
import z from 'zod';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  // /api/check-username-unique?username=nishant
  // if username exists in db and isVerified = false,
  // it is unique username and not taken at the time
  // otherwise if isVerified = true, it is taken so not unique

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    // zod validation
    const result = UsernameQuerySchema.safeParse(queryParam);
    // TODO: remove after logging and checking
    // console.log(result);

    if (!result.success) {
      // zod 4 new syntax for errors
      const usernameErrors =
        z.flattenError(result.error).fieldErrors.username || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(',')
              : 'Invalid query parameters',
        },
        { status: 400 },
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        AND: [{ username, isVerified: true }],
      },
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 },
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error checking username', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 },
    );
  }
}
