'use client';

import Section from '@/components/ui/Section';
import AccommodationCard from './AccommodationCard';
import type { Hebergement } from '@/lib/supabase/queries';
import { useRef, useState, useEffect } from 'react';
import { Title } from '../ui';

interface AccommodationRecommendedProps {
	hebergements: Hebergement[];
	dict: any;
}

export default function AccommodationRecommended({
	hebergements,
	dict,
}: AccommodationRecommendedProps) {
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
		<Section variant="default" spacing="lg">
			<div ref={containerRef} className="max-w-4xl mx-auto">
				<div className="text-center mb-8 sm:mb-10">
					<Title level="h3" align="center">
						{dict.accommodation.recommended}
					</Title>
					<p className="text-foreground-muted">
						{dict.accommodation.recommendedDescription}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{hebergements.map((hebergement, index) => (
						<div
							key={hebergement.id}
							className={`transition-all duration-700 ${
								isVisible
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10'
							}`}
							style={{
								transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
							}}
						>
							<AccommodationCard hebergement={hebergement} />
						</div>
					))}
				</div>
			</div>
		</Section>
	);
}
