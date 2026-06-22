import Link from 'next/link';
import { EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col grow justify-center items-center bg-background min-h-[80vh] px-4 py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 border border-slate-200/50">
        <EyeOff className="h-8 w-8 text-slate-400/80" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-3">
        Lost in the void.
      </h1>
      <p className="text-slate-500 mb-8 max-w-md text-base font-medium">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="px-6 font-semibold transition-transform hover:scale-[1.02] shadow-md">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
