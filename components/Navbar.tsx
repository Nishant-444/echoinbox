'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { LogOut, User as UserIcon, Copy } from 'lucide-react';
import { Github } from '@/components/icons';

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
import { toast } from 'sonner';

export default function Navbar() {
	const { data: session } = useSession();
	const user: User = session?.user as User;
	const pathname = usePathname();

	const [profileUrl, setProfileUrl] = useState('');

	useEffect(() => {
		if (typeof window !== 'undefined' && user?.username) {
			setProfileUrl(`${window.location.origin}/u/${user.username}`);
		}
	}, [user?.username]);

	const handleCopyLink = () => {
		if (!profileUrl) return;
		navigator.clipboard.writeText(profileUrl)
			.then(() => {
				toast.success('Link copied to clipboard!');
			})
			.catch(() => {
				toast.error('Failed to copy link');
			});
	};

	const initial = (user?.username || user?.email || 'U')[0].toUpperCase();

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
			<div className="container mx-auto px-4 h-16 flex justify-between items-center">

				{/* Brand Logo */}
				<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
					<img src="/image.png" alt="EchoInbox Logo" className="h-6 w-6 object-contain" />
					<span className="text-xl font-bold tracking-tight text-slate-900">
            EchoInbox
          </span>
				</Link>

				{/* Navigation & Auth */}
				{session ? (
					<div className="flex items-center gap-4">
						{profileUrl && (
							<Button
								onClick={handleCopyLink}
								variant="outline"
								className="font-semibold transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2"
							>
								<Copy className="h-4 w-4 text-slate-500" />
								<span className="hidden sm:inline">Copy My Link</span>
							</Button>
						)}

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
								<DropdownMenuItem asChild className="cursor-pointer">
									<Link href="/dashboard" className="flex items-center gap-2 w-full">
										<UserIcon className="h-4 w-4 text-slate-500" />
										<span>Profile Settings</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => signOut()}
									className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 w-full"
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
	);
}