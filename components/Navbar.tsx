'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { LogOut, Trash2 } from 'lucide-react';
import { Github } from '@/components/icons';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Navbar() {
	const { data: session } = useSession();
	const user: User = session?.user as User;
	const pathname = usePathname();

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const initial = (user?.username || user?.email || 'U')[0].toUpperCase();

	const handleDeleteAccount = async () => {
		setIsDeleting(true);
		try {
			const response = await axios.delete('/api/delete-account');
			if (response.data.success) {
				toast.success('Account deleted successfully');
				await signOut({ callbackUrl: '/' });
			} else {
				toast.error('Error', {
					description: response.data.message || 'Failed to delete account.',
				});
			}
		} catch (error) {
			const axiosError = error as AxiosError<{ message?: string }>;
			toast.error('Error', {
				description: axiosError.response?.data?.message || 'Failed to delete account.',
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteDialogOpen(false);
		}
	};

	return (
		<>
			<nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-16 flex justify-between items-center">

					{/* Brand Logo */}
					<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
						<img src="/logo.svg" alt="EchoInbox Logo" className="h-6 w-6 object-contain" />
						<span className="text-xl font-bold tracking-tight text-slate-900">
							EchoInbox
						</span>
					</Link>

					{/* Navigation & Auth */}
					{session ? (
						<div className="flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden hover:opacity-90">
										<Avatar className="h-8 w-8">
											<AvatarFallback className="bg-primary text-primary-foreground font-semibold">
												{initial}
											</AvatarFallback>
										</Avatar>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end">
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-semibold text-slate-900 leading-none">
												{user?.username}
											</p>
											<p className="text-xs text-slate-500 leading-none truncate">
												{user?.email}
											</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onSelect={(e) => {
											e.preventDefault();
											setIsDeleteDialogOpen(true);
										}}
										className="cursor-pointer flex items-center gap-2 w-full"
									>
										<Trash2 className="h-4 w-4" />
										<span>Delete Account</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										variant="destructive"
										onClick={() => signOut()}
										className="cursor-pointer flex items-center gap-2 w-full"
									>
										<LogOut className="h-4 w-4" />
										<span>Sign Out</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<Button asChild variant="outline" className="font-semibold transition-all hover:scale-[1.02]">
								<a href="https://github.com/Nishant-444/echoinbox" target="_blank" rel="noopener noreferrer">
									<Github className="h-4 w-4 mr-2 text-slate-500" />
									<span className="hidden md:inline">Star on GitHub</span>
								</a>
							</Button>
							<Button asChild variant="ghost" className="font-semibold transition-all hover:scale-[1.02]">
								<Link href="/sign-in">Login</Link>
							</Button>
							<Button asChild variant="default" className="font-semibold transition-all hover:scale-[1.02] shadow-sm">
								<Link href="/sign-up">Sign Up</Link>
							</Button>
						</div>
					)}
				</div>
			</nav>

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your account,
							all associated messages, and remove all your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteAccount}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700 text-white"
						>
							{isDeleting ? 'Deleting...' : 'Delete Account'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}