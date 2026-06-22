'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Mail } from 'lucide-react';

interface Message {
  title: string;
  content: string;
  received: string;
}

interface TestimonialCarouselProps {
  messages: Message[];
}

export default function TestimonialCarousel({ messages }: TestimonialCarouselProps) {
  return (
    <Carousel
      plugins={[Autoplay({ delay: 3000 })]}
      className="w-full"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {messages.map((message, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
            <div className="p-1">
              <Card className="border-slate-200 shadow-sm bg-white h-full hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">
                    {message.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-30">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-neutral-500 shrink-0 mt-0.5" />
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
  );
}
