import React from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/options';
import { prisma } from '@/src/lib/prisma';
import DashboardClient from './DashboardClient';

export default async function UserDashboardPage() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		redirect('/sign-in');
	}

	const userId = session.user.id;

	// Parallel Fetching to prevent waterfalls
	const [user, messages] = await Promise.all([
		prisma.user.findUnique({
			where: { id: userId },
			select: { isAcceptingMessage: true, username: true },
		}),
		prisma.message.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		}),
	]);

	if (!user) {
		redirect('/sign-in');
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
		|| (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

	return (
		<DashboardClient
			initialMessages={messages}
			initialAcceptMessages={user.isAcceptingMessage}
			username={user.username}
			baseUrl={baseUrl}
		/>
	);
}