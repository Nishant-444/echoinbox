import { prisma } from '@/src/lib/prisma';
import VerifyForm from './VerifyForm';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function VerifyPage({ params }: PageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Use findUnique since username is a unique column (faster DB performance)
  const user = await prisma.user.findUnique({
    where: { username: decodedUsername },
  });

  if (user && user.isVerified) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background p-4">
        <Card className="w-full sm:max-w-md shadow-lg border-slate-200 p-6 text-center">
          <CardHeader className="flex flex-col items-center mt-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900 font-bold">
              You're already verified!
            </CardTitle>
            <CardDescription className="text-slate-500 mt-2 text-base">
              Your email is confirmed and your inbox is ready to receive messages.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4 mb-6">
            <Button asChild className="w-full font-semibold transition-transform hover:scale-[1.01]">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <VerifyForm username={decodedUsername} />;
}
