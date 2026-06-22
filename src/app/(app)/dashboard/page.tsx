'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Settings2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { acceptMessageSchema } from '@/src/schema/acceptMessageSchema';
import { ApiResponse } from '@/src/types/ApiResponse';

type Message = {
	id: string;
	content: string;
	createdAt: Date | string;
};

export default function UserDashboard() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);
	const [profileUrl, setProfileUrl] = useState('');
	const [copied, setCopied] = useState(false);

	const { data: session, status } = useSession();

	const form = useForm({
		resolver: zodResolver(acceptMessageSchema),
		defaultValues: {
			acceptMessages: false,
		},
	});

	const { register, watch, setValue, reset } = form;
	const acceptMessages = watch('acceptMessages');

	useEffect(() => {
		if (typeof window !== 'undefined' && session?.user?.username) {
			const baseUrl = `${window.location.protocol}//${window.location.host}`;
			setProfileUrl(`${baseUrl}/u/${session.user.username}`);
		}
	}, [session]);

	const handleDeleteMessage = (messageId: string) => {
		setMessages(messages.filter((message) => message.id !== messageId));
	};

	const fetchAcceptMessages = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>('/api/accept-messages');
			reset({ acceptMessages: response.data.isAcceptingMessage });
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error('Error', {
				description: axiosError.response?.data.message || 'Failed to fetch settings',
			});
		} finally {
			setIsSwitchLoading(false);
		}
	}, [reset]);

	const fetchMessages = useCallback(
		async (refresh: boolean = false) => {
			setIsLoading(true);
			setIsSwitchLoading(false);
			try {
				const response = await axios.get<ApiResponse>('/api/get-messages');
				setMessages(response.data.messages || []);
				if (refresh) {
					toast.success('Messages Refreshed', {
						description: 'Showing latest messages',
					});
				}
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse>;
				toast.error('Error', {
					description: axiosError.response?.data.message ?? 'Failed to fetch messages',
				});
			} finally {
				setIsLoading(false);
				setIsSwitchLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		if (!session || !session.user) return;
		void fetchMessages();
		void fetchAcceptMessages();
	}, [session, fetchAcceptMessages, fetchMessages]);

	const handleSwitchChange = async () => {
		try {
			const response = await axios.post<ApiResponse>('/api/accept-messages', {
				acceptMessages: !acceptMessages,
			});
			setValue('acceptMessages', !acceptMessages);
			toast.success('Success', {
				description: response.data.message,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error('Error', {
				description: axiosError.response?.data.message || 'Failed to update settings',
			});
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(profileUrl);
			toast.success('URL Copied!', {
				description: 'Profile link copied to clipboard.',
			});
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (error) {
			toast.error('Copy Failed', {
				description: 'Could not copy to clipboard. Please copy it manually.',
			});
		}
	};

	if (status === 'loading') {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
			</div>
		);
	}

	if (!session || !session.user) {
		return null;
	}

	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-xl w-full max-w-6xl shadow-sm border border-slate-200">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
					Dashboard
				</h1>
				<Button
					variant="outline"
					onClick={async (e) => {
						e.preventDefault();
						await fetchMessages(true);
					}}
					className="hover:bg-slate-50"
				>
					{isLoading ? (
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
					) : (
						<RefreshCcw className="h-4 w-4 mr-2" />
					)}
					Refresh
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				{/* URL Card */}
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
					<h2 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
						Your Unique Link
					</h2>
					<div className="flex items-center gap-2">
						<Input
							type="text"
							value={profileUrl}
							readOnly
							className="bg-white "
							aria-label="Your unique profile link"
						/>
						<Button
							onClick={copyToClipboard}
							variant={copied ? "outline" : "secondary"}
							className={`w-12 md:w-28 shrink-0 transition-all ${copied ? "border-green-500 text-green-700 bg-green-50/50 hover:bg-green-50/50" : ""
								}`}
						>
							{copied ? (
								<>
									<Check className="h-4 w-4 text-green-600 md:mr-2" />
									<span className="hidden md:inline text-green-700">Copied!</span>
								</>
							) : (
								<>
									<Copy className="h-4 w-4 md:mr-2" />
									<span className="hidden md:inline">Copy</span>
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Settings Card */}
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-center">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Settings2 className="h-5 w-5 text-slate-500" />
							<div>
								<h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
									Message Acceptance
								</h2>
								<p className="text-xs text-slate-500 mt-0.5">
									{acceptMessages ? 'Your inbox is open.' : 'Your inbox is closed.'}
								</p>
							</div>
						</div>
						<Switch
							{...register('acceptMessages')}
							checked={acceptMessages}
							onCheckedChange={handleSwitchChange}
							disabled={isSwitchLoading}
						/>
					</div>
				</div>
			</div>

			<Separator className="my-6" />

			<h2 className="text-xl font-semibold text-slate-900 mb-6">Your Messages</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{messages.length > 0 ? (
					messages.map((message) => (
						<MessageCard
							key={message.id}
							message={message}
							onMessageDelete={handleDeleteMessage}
						/>
					))
				) : (
					<div className="col-span-full py-12 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
						<p className="text-slate-500 font-medium">No messages yet.</p>
						<p className="text-sm text-slate-400 mt-1">Share your link to start receiving feedback!</p>
					</div>
				)}
			</div>
		</div>
	);
}