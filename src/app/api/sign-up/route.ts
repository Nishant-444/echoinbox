import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/src/helpers/sendVerificationEmail';
import { prisma } from '@/src/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      if (existingUserByUsername.isVerified) {
        return Response.json(
          { success: false, message: 'Username is already taken' },
          { status: 400 }
        );
      }

      if (existingUserByUsername.email !== email) {
        const ONE_DAY = 24 * 60 * 60 * 1000;
        const accountAge = Date.now() - new Date(existingUserByUsername.createdAt).getTime();

        if (accountAge < ONE_DAY) {
          return Response.json(
            { success: false, message: 'Username is currently reserved. Try again later.' },
            { status: 400 }
          );
        } else {
          await prisma.user.delete({
            where: { id: existingUserByUsername.id },
          });
        }
      }
    }

    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
          where: { email },
          data: {
            username,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          },
        });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessage: true,
        },
      });
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}