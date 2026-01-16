'use client';

import AccommodationCard from './AccommodationCard';
import type { Hebergement } from '@/lib/supabase/queries';
import { useRef, useState, useEffect } from 'react';
import { Title } from '../ui';

interface AccommodationTypeGroupProps {
	type: Hebergement['type'];
	items: Hebergement[];
	typeLabel: string;
}

export default function AccommodationTypeGroup({
	type,
	items,
	typeLabel,
}: AccommodationTypeGroupProps) {
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
				<Title level="h5" align="left">
					{typeLabel}
					<span className="text-foreground-muted text-sm sm:text-lg ml-2 font-normal">
						({items.length})
					</span>
				</Title>
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
						<AccommodationCard hebergement={hebergement} />
					</div>
				))}
			</div>
		</div>
	);
}
