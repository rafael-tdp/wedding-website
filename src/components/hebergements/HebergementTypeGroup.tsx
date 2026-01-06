'use client';

import HebergementCard from './HebergementCard';
import type { Hebergement } from '@/lib/supabase/queries';
import { useRef, useState, useEffect } from 'react';

interface HebergementTypeGroupProps {
	type: Hebergement['type'];
	items: Hebergement[];
	typeLabel: string;
}

export default function HebergementTypeGroup({
	type,
	items,
	typeLabel,
}: HebergementTypeGroupProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						if (containerRef.current) {
							observer.unobserve(containerRef.current);
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, []);

	return (
		<div ref={containerRef} className="space-y-6 sm:space-y-8">
			{/* Type Header */}
			<div
				className={`transition-all duration-700 ${
					isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
				}`}
				style={{
					transitionDelay: isVisible ? '0ms' : '0ms',
				}}
			>
				<h3 className="text-lg sm:text-2xl font-serif text-foreground flex items-center gap-2">
					{typeLabel}
					<span className="text-foreground-muted text-sm sm:text-lg ml-2 font-normal">
						({items.length})
					</span>
				</h3>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{items.map((hebergement, index) => (
					<div
						key={hebergement.id}
						className={`transition-all duration-700 ${
							isVisible
								? 'opacity-100 translate-y-0'
								: 'opacity-0 translate-y-10'
						}`}
						style={{
							transitionDelay: isVisible ? `${(index + 1) * 100}ms` : '0ms',
						}}
					>
						<HebergementCard hebergement={hebergement} />
					</div>
				))}
			</div>
		</div>
	);
}
