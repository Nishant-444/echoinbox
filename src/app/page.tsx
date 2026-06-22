import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/options';
import { MessageSquareQuote } from 'lucide-react';
import HeroButtons from '@/components/HeroButtons';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import messages from '../messages.json';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-20">
        <section className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center">
          <div
            className="mb-6 flex items-center justify-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <MessageSquareQuote className="w-4 h-4 text-primary"/>
            <span className="text-sm font-medium text-primary">
              EchoInbox is now live
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Dive into the World of <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-950 via-neutral-800 to-neutral-700">
              Anonymous Feedback
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl">
            Empower your audience to share their honest thoughts. Generate your unique link, share it with your network,
            and receive unfiltered, secure messages.
          </p>

          <HeroButtons isLoggedIn={!!session} />
        </section>

        {/* Social Proof / Carousel Section */}
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
            See how others are using it
          </p>
          <TestimonialCarousel messages={messages} />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} EchoInbox. Built for secure feedback.
        </p>
      </footer>
    </div>
  );
}