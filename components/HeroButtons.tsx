'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroButtonsProps {
  isLoggedIn: boolean;
}

export default function HeroButtons({ isLoggedIn }: HeroButtonsProps) {
  if (isLoggedIn) {
    return (
      <div className="flex justify-center">
        <Button asChild size="lg" variant="secondary" className="font-semibold text-md hover:scale-[1.02] transition-all shadow-sm">
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button asChild size="lg" variant="default" className="font-semibold text-md shadow-md hover:scale-[1.02] transition-all">
        <Link href="/sign-up">
          Get Started <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}

