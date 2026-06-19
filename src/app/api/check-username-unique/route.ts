import { prisma } from '@/src/lib/prisma';
import { userNameValidation } from '@/src/schema/signUpSchema';
import z from 'zod';

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(req: Request) {
  // localhost:3000/api/check-username-unique?username=nishant
  // if username exists in db and isVerified = false,
  // it is unique username and not taken at the time
  // otherwise if isVerified = true, it is taken so not unique

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      userName: searchParams.get('username'),
    };

    // zod validation
    const result = UserNameQuerySchema.safeParse(queryParam);
    // TODO: remove after logging and checking
    // console.log(result);

    if (!result.success) {
      // zod 4 new syntax for errors
      const userNameErrors =
        z.flattenError(result.error).fieldErrors.userName || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(',')
              : 'Invalid query parameters',
        },
        { status: 400 },
      );
    }
    const { userName } = result.data;
    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        AND: [{ userName, isVerified: true }],
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
        message: 'Username unique',
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
