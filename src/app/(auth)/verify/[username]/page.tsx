'use client';

import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { verifySchema } from '@/src/schema/verifySchema';
import { ApiResponse } from '@/src/types/ApiResponse';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast.success('Account Verified', {
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message || axiosError.message;

      toast.error('Verification Failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full sm:max-w-md shadow-lg border-slate-200 p-4">
        <CardHeader className="mt-6 mb-6">
          <CardTitle className="text-center text-2xl">
            Verify Your Account
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter the verification code sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Verification Code
                    </FieldLabel>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        id={field.name}
                        className="pl-9 tracking-widest font-mono text-lg" // 🌟 Makes the OTP code look clean and readable
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Account'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
