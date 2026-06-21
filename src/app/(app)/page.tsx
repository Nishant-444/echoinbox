'use client';

import Link from 'next/link';
import {ArrowRight, Mail, MessageSquareQuote} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import messages from '../../messages.json';

export default function Home() {
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

					<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
						<Button asChild size="lg"
						        className="font-semibold text-md w-full sm:w-auto shadow-md hover:scale-[1.02] transition-all">
							<Link href="/sign-up">
								Get Started <ArrowRight className="ml-2 w-4 h-4"/>
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline"
						        className="font-semibold text-md w-full sm:w-auto hover:bg-slate-100">
							<Link href="/sign-in">
								Go to Dashboard
							</Link>
						</Button>
					</div>
				</section>

				{/* Social Proof / Carousel Section */}
				<div className="w-full max-w-3xl mx-auto flex flex-col items-center">
					<p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
						See how others are using it
					</p>
					<Carousel
						plugins={[Autoplay({delay: 3000})]}
						className="w-full"
						opts={{
							align: "start",
							loop: true,
						}}
					>
						<CarouselContent>
							{messages.map((message, index) => (
								<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
									<div className="p-1">
										<Card
											className="border-slate-200 shadow-sm bg-white h-full hover:shadow-md transition-shadow duration-300">
											<CardHeader className="pb-2">
												<CardTitle className="text-base font-semibold text-slate-800">
													{message.title}
												</CardTitle>
											</CardHeader>
											<CardContent className="flex flex-col justify-between h-30">
												<div className="flex items-start space-x-3">
													<Mail className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5"/>
													<p className="text-sm text-slate-600 line-clamp-3">
														"{message.content}"
													</p>
												</div>
												<p className="text-xs font-medium text-slate-400 mt-4 text-right">
													{message.received}
												</p>
											</CardContent>
										</Card>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
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