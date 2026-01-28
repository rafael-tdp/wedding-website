"use client";

import { useRef, useState, useEffect } from "react";
import Card from "./Card";

interface InfoCard {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}

interface InfoCardsProps {
	title: string;
	cards: InfoCard[];
	withAccent?: boolean;
	columns?: "1" | "2" | "3" | "4";
}

export default function InfoCards({
	cards,
	columns = "2",
}: InfoCardsProps) {
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
			{ threshold: 0.1 },
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

	const gridColsMap = {
		"1": "grid-cols-1",
		"2": "sm:grid-cols-2",
		"3": "sm:grid-cols-3",
		"4": "sm:grid-cols-4",
	};

	return (
			<div ref={containerRef} className="max-w-7xl mx-auto space-y-12">
			

			<div className={`grid grid-cols-1 ${gridColsMap[columns]} gap-4 sm:gap-6 auto-rows-fr`}>
				{cards.map((card, index) => {
					const Icon = card.icon;
					return (
						<Card
							key={index}
							variant="default"
							className={`h-full rounded-lg p-6 transition-all duration-700 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-10"
							}`}
							icon={<Icon className="w-8 h-8 text-primary" />}
							title={card.title}
							description={card.description}
						/>
					);
				})}
			</div>
		</div>
	);
}
