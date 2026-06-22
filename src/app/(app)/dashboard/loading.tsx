import React from 'react';
import { Separator } from '@/components/ui/separator';

export default function DashboardLoading() {
	return (
		<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-xl w-full max-w-6xl shadow-sm border border-slate-200 animate-pulse">
			{/* Title Skeleton */}
			<div className="flex items-center justify-between mb-8">
				<div className="h-9 w-48 bg-slate-200 rounded-md"></div>
				<div className="h-10 w-24 bg-slate-200 rounded-md"></div>
			</div>

			{/* Cards Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-200 h-24 flex flex-col justify-between">
					<div className="h-4 w-32 bg-slate-200 rounded-md"></div>
					<div className="flex gap-2">
						<div className="h-10 grow bg-slate-200 rounded-md"></div>
						<div className="h-10 w-12 md:w-28 bg-slate-200 rounded-md"></div>
					</div>
				</div>
				<div className="p-4 bg-slate-50 rounded-lg border border-slate-200 h-24 flex items-center justify-between">
					<div className="space-y-2">
						<div className="h-4 w-36 bg-slate-200 rounded-md"></div>
						<div className="h-3 w-28 bg-slate-200 rounded-md"></div>
					</div>
					<div className="h-6 w-11 bg-slate-200 rounded-full"></div>
				</div>
			</div>

			<Separator className="my-6" />

			{/* Message Cards Skeleton */}
			<div className="h-7 w-36 bg-slate-200 rounded-md mb-6"></div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="border border-slate-200 shadow-sm rounded-xl p-6 h-40 flex flex-col justify-between">
						<div className="space-y-3">
							<div className="h-3 w-24 bg-slate-200 rounded-md"></div>
							<div className="h-4 w-full bg-slate-200 rounded-md"></div>
							<div className="h-4 w-5/6 bg-slate-200 rounded-md"></div>
						</div>
						<div className="h-3 w-16 bg-slate-200 rounded-md mt-4"></div>
					</div>
				))}
			</div>
		</div>
	);
}
