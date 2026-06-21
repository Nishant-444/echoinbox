import { z } from 'zod';

// Single element check
export const usernameValidation = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be no more than 30 characters')
  .regex(
    /^[a-z0-9_-]+$/,
    'Username can only contain lowercase letters, numbers, underscores, and hyphens',
  );

export const signUp = z.object({
  username: usernameValidation,

  email: z.string().email({ message: 'Invalid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(32, { message: 'Password must be at most 32 characters' })
    .regex(/[a-zA-Z]/, {
      message: 'Password must contain at least one letter',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number',
    })
    .regex(/[\W_]/, {
      message: 'Password must contain at least one special character',
    }),
});
