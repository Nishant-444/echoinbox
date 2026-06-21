import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";
import AuthProvider from "@/src/context/authProvider";
import React from "react";

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'EchoInbox | Secure, Anonymous Feedback & Messages',
	description: 'Empower your audience to share their honest thoughts. Generate your unique link, share it on Instagram/Snapchat, and receive secure, private feedback.',
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
		<body className="min-h-full flex flex-col">
		<AuthProvider>
			<Navbar/>
			{children}
		</AuthProvider>
		</body>

		</html>
	);
}
