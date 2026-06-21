'use client';

import React from 'react';
import axios, {AxiosError} from 'axios';
import dayjs from 'dayjs';
import {Trash2} from 'lucide-react';
import {toast} from 'sonner';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {ApiResponse} from "@/src/types/ApiResponse";

type Message = {
	id: string;
	content: string;
	createdAt: Date | string;
};

type MessageCardProps = {
	message: Message;
	onMessageDelete: (messageId: string) => void;
};

export function MessageCard({message, onMessageDelete}: MessageCardProps) {
	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete<ApiResponse>(
				`/api/delete-message/${message.id}`
			);

			toast.success('Deleted', {
				description: response.data.message,
			});

			onMessageDelete(message.id);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toast.error('Error', {
				description: axiosError.response?.data.message ?? 'Failed to delete message',
			});
		}
	};

	return (
		<Card className="border-slate-200 shadow-sm transition-all hover:shadow-md">
			<CardHeader className="flex flex-row justify-between items-start pb-2">
				<div>
					<CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
						Anonymous Message
					</CardTitle>
					<CardDescription className="text-xs text-slate-400 mt-1">
						{dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
					</CardDescription>
				</div>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="text-slate-400 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
						>
							<Trash2 className="w-4 h-4"/>
							<span className="sr-only">Delete message</span>
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this message?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently remove the message from your inbox.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteConfirm}
								className="bg-red-600 hover:bg-red-700 text-white"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardHeader>

			<CardContent>
				<p className="text-slate-800 text-base leading-relaxed">
					{message.content}
				</p>
			</CardContent>
		</Card>
	);
}