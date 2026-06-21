'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { Loader2, Send, Sparkles, AlertCircle, MessageSquare, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { messageSchema } from '@/src/schema/messageSchema';
import { ApiResponse } from '@/src/types/ApiResponse';
import Link from 'next/link';

// Highly engaging fallback questions in case Groq is rate-limited or unavailable
const FALLBACK_QUESTIONS = [
  "What is one thing you would change about me if you could?",
  "What was your first impression of me, and how has it changed?",
  "If we were in a movie together, what roles would we play?",
  "What's a secret you've never told anyone?",
  "What is your biggest pet peeve about social media?",
  "If you could travel anywhere right now, where would you go?",
  "What is the most adventurous thing you've ever done?",
  "What is a song that always makes you happy?",
  "If you had a superpower, what would it be and why?",
  "What's the best advice you've ever received?"
];

export default function SendMessagePage() {
  const { username } = useParams<{ username: string }>();
  const decodedUsername = decodeURIComponent(username);

  // States
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [exists, setExists] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // React Hook Form
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const { control, handleSubmit, watch, reset, setValue, trigger } = form;
  const content = watch('content') || '';

  // Check user status on load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        setIsUserLoading(true);
        const response = await axios.get<ApiResponse>(`/api/get-status/${username}`);
        if (response.data.success) {
          setExists(true);
          setIsAccepting(!!response.data.isAcceptingMessage);
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          setExists(false);
        } else {
          toast.error('Error checking status', {
            description: axiosError.response?.data.message || 'Could not verify user availability.',
          });
        }
      } finally {
        setIsUserLoading(false);
      }
    };

    if (username) {
      checkUserStatus();
    }
  }, [username]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Initial load suggestions
  useEffect(() => {
    // Show a set of 3 random fallback questions immediately on page load
    const shuffled = [...FALLBACK_QUESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 3));
  }, []);

  // Fetch AI suggested questions
  const fetchSuggestions = async () => {
    if (cooldown > 0) return;
    setIsSuggesting(true);
    setCooldown(5); // Start 5 seconds cooldown

    try {
      const response = await axios.post('/api/suggest-messages');
      if (response.data?.success && response.data?.messages) {
        setSuggestions(response.data.messages);
        toast.success('Suggestions updated!');
      } else {
        throw new Error('Invalid suggestions format');
      }
    } catch (error) {
      console.warn('AI suggestions failed, falling back to predefined list:', error);
      // Grab 3 random questions from fallback questions
      const shuffled = [...FALLBACK_QUESTIONS].sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));
      toast.info('Loaded backup suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  };

  // Populate content from suggestion card
  const handleSelectSuggestion = async (suggestion: string) => {
    setValue('content', suggestion);
    // Explicitly validate field after setting value
    await trigger('content');
  };

  // Submit message
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: decodedUsername,
        content: data.content,
      });

      if (response.data.success) {
        toast.success('Message Sent!', {
          description: 'Your anonymous feedback was successfully delivered.',
        });
        reset({ content: '' });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Failed to Send', {
        description: axiosError.response?.data.message || 'There was a problem sending your message.',
      });
    }
  };

  // Loading state skeleton/spinner
  if (isUserLoading) {
    return (
      <div className="flex flex-col grow justify-center items-center bg-background min-h-[80vh] px-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Checking inbox status...</p>
      </div>
    );
  }

  // Target user not found
  if (!exists) {
    return (
      <div className="flex flex-col grow justify-center items-center bg-background min-h-[80vh] px-4">
        <Card className="w-full max-w-md shadow-md border-slate-200 p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900 font-bold">User Not Found</CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              The user <span className="font-semibold text-slate-800">@{decodedUsername}</span> does not exist or has deleted their account.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Button asChild className="w-full">
              <Link href="/">Create Your Own EchoInbox</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Target user not accepting messages
  if (!isAccepting) {
    return (
      <div className="flex flex-col grow justify-center items-center bg-background min-h-[80vh] px-4">
        <Card className="w-full max-w-md shadow-md border-slate-200 p-6 text-center">
          <CardHeader className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle className="text-2xl text-slate-900 font-bold">Inbox Closed</CardTitle>
            <CardDescription className="text-slate-500 mt-2">
              <span className="font-semibold text-slate-800">@{decodedUsername}</span> is not accepting anonymous messages at the moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grow bg-background py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Message Sending Card */}
        <Card className="shadow-lg border-slate-200 overflow-hidden bg-white/80 backdrop-blur-md px-0 pt-0">
          <CardHeader className="bg-muted/40 border-b border-border/20 py-6 px-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl text-slate-900 font-bold">
                  Send Anonymous Message
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium">
                  to @{decodedUsername}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-6 px-6 md:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <Controller
                  name="content"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex justify-between items-center mb-2">
                        <FieldLabel htmlFor="content" className="text-slate-700 font-semibold">
                          Your Secret Message
                        </FieldLabel>
                        <span className={`text-xs font-semibold ${content.length > 400 ? 'text-red-500' : 'text-slate-400'}`}>
                          {content.length}/400 chars
                        </span>
                      </div>
                      <Textarea
                        {...field}
                        id="content"
                        placeholder="Write something anonymous, fun, or encouraging..."
                        className="min-h-32 text-base md:text-sm bg-white resize-none"
                        aria-invalid={fieldState.invalid}
                        maxLength={450}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="font-semibold px-6 hover:scale-[1.02] transition-transform shadow-md"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Suggestion Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-zinc-500" />
                Need ideas?
              </h2>
              <p className="text-sm text-slate-500">
                Click any prompt below to automatically paste it into your message card.
              </p>
            </div>

            <Button
              onClick={fetchSuggestions}
              variant="outline"
              size="sm"
              disabled={isSuggesting || cooldown > 0}
              className="bg-white border-slate-200 shadow-xs text-xs font-semibold hover:bg-slate-50 transition-colors shrink-0"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : cooldown > 0 ? (
                `Cooldown (${cooldown}s)`
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
                  Suggest Messages
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-zinc-400 hover:shadow-xs hover:bg-zinc-50/20 active:bg-zinc-100/50 transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                <p className="text-slate-700 text-sm font-medium leading-relaxed group-hover:text-zinc-900">
                  "{suggestion}"
                </p>
                <span className="text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-1 mt-0.5">
                  Use
                  <Send className="h-3 w-3" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info link */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 font-medium">
            Want to receive anonymous feedback yourself?{' '}
            <Link href="/" className="text-primary font-semibold hover:underline">
              Create an account on EchoInbox
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}