'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import { MessageSquare, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Navbar() {
	const { data: session } = useSession();
	const user: User = session?.user as User;
	const pathname = usePathname();

	const isDashboard = pathname === '/dashboard';

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
					<div className="flex items-center gap-4 md:gap-6">
            <span className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 text-slate-500" />
	            {user.username || user.email}
            </span>

						<div className="flex items-center gap-2">
							{!isDashboard && (
								<Button asChild variant="secondary" className="font-semibold transition-all hover:scale-[1.02]">
									<Link href="/dashboard">
										<LayoutDashboard className="h-4 w-4 mr-2 text-slate-500" />
										Dashboard
									</Link>
								</Button>
							)}
							<Button
								onClick={() => signOut()}
								variant="outline"
								className="font-semibold transition-all hover:scale-[1.02]"
							>
								<LogOut className="h-4 w-4 mr-2 text-slate-500" />
								<span className="hidden sm:inline">Logout</span>
							</Button>
						</div>
					</div>
				) : (
					<Button asChild variant="default" className="font-semibold transition-all hover:scale-[1.02] shadow-sm">
						<Link href="/sign-in">Login</Link>
					</Button>
				)}
			</div>
		</nav>
	);
}