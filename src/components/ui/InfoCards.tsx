"use client";

import { Title } from "@/components/ui";
import { useRef, useState, useEffect } from "react";

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
	title,
	cards,
	withAccent = true,
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
			<div ref={containerRef} className="max-w-3xl mx-auto space-y-6">
			<Title level="h2" align="center" withAccent={withAccent}>
				{title}
			</Title>

			<div className={`grid grid-cols-1 ${gridColsMap[columns]} gap-4 sm:gap-6 auto-rows-fr`}>
				{cards.map((card, index) => {
					const Icon = card.icon;
					return (
						<div
							key={index}
							className={`bg-background p-5 sm:p-6 rounded-lg transition-all duration-1000 relative h-full ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-10"
							}`}
							style={{
								transitionDelay: isVisible
									? `${index * 250}ms`
									: "0ms",
							}}
						>
							<h3 className="text-base sm:text-lg text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary font-semibold font-sans">
								<span>{card.title}</span>
							</h3>
							<p className="text-foreground-muted text-xs sm:text-sm">
								{card.description}
							</p>
							<div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-7xl sm:text-8xl text-primary/15 sm:text-5xl">
								<Icon />
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
