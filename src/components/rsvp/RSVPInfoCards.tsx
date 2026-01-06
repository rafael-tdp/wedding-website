"use client";

import {
	MdCalendarMonth,
	MdRestaurant,
	MdMusicNote,
	MdHelpOutline,
} from "react-icons/md";
import { Title } from "@/components/ui";
import { useRef, useState, useEffect } from "react";

interface RSVPInfoCardsProps {
	dict: any;
}

const INFO_CARDS = [
	{
		icon: MdCalendarMonth,
		titleKey: "deadline",
		textKey: "deadlineText",
	},
	{
		icon: MdRestaurant,
		titleKey: "menu",
		textKey: "menuText",
	},
	{
		icon: MdMusicNote,
		titleKey: "music",
		textKey: "musicText",
	},
	{
		icon: MdHelpOutline,
		titleKey: "questions",
		textKey: "questionsText",
	},
];

export default function RSVPInfoCards({ dict }: RSVPInfoCardsProps) {
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
		<div
			ref={containerRef}
			className="max-w-3xl mx-auto space-y-6 px-4 sm:px-0"
		>
			<Title level="h2" align="center" withAccent>
				{dict.rsvp.important}
			</Title>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				{INFO_CARDS.map((card, index) => {
					const Icon = card.icon;
					return (
						<div
							key={card.titleKey}
							className={`bg-background p-4 sm:p-6 rounded-lg transition-all duration-1000 ${
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
							<h3 className="text-base sm:text-lg font-serif text-foreground mb-2 sm:mb-3 flex items-center gap-2 text-primary">
								<Icon className="text-lg sm:text-xl flex-shrink-0" />
								<span>{dict.rsvp[card.titleKey]}</span>
							</h3>
							<p className="text-foreground-muted text-xs sm:text-sm">
								{dict.rsvp[card.textKey]}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
