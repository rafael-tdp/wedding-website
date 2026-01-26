"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { useEffect, useRef, useState } from "react";

interface PracticalInfoItem {
	icon: React.ReactNode;
	title: string;
	description: string;
	href: string;
}

interface PracticalInfoProps {
	items: PracticalInfoItem[];
	learnMoreText?: string;
}

/**
 * Composant pour afficher les cartes d'informations pratiques
 * Réutilisable sur la page d'accueil et la page infos
 */
export default function PracticalInfo({
	items,
	learnMoreText = "En savoir plus",
}: PracticalInfoProps) {
	const [visibleItems, setVisibleItems] = useState<boolean[]>(
		new Array(items.length).fill(false)
	);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		// Intersection Observer pour détecter quand les cartes entrent dans le viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = itemRefs.current.indexOf(
						entry.target as HTMLDivElement
					);
					if (index !== -1) {
						if (entry.isIntersecting) {
							setVisibleItems((prev) => {
								const newVisible = [...prev];
								newVisible[index] = true;
								return newVisible;
							});
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		itemRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => {
			itemRefs.current.forEach((ref) => {
				if (ref) observer.unobserve(ref);
			});
		};
	}, []);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 auto-rows-fr">
			{items.map((item, index) => (
				<div
					key={index}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					className={`transition-all duration-700 ${
						visibleItems[index]
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-10"
					}`}
				>
					<Link href={item.href} className="block group h-full">
						<Card
							variant="default"
							className="h-full transition-all duration-300"
						>
							<div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5 h-full border-[1px] border-primary/20 p-3 sm:p-4 md:p-6 rounded-sm group-hover:border-primary/50 transition-all duration-300">
								{/* Icon in circle */}
								<div className="p-3 sm:p-3 md:p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300 flex-shrink-0">
									{item.icon}
								</div>

								{/* Content container */}
								<div className="flex-grow md:flex-grow-0 space-y-1 sm:space-y-2 md:space-y-3 flex flex-col justify-between md:items-center md:text-center">
									{/* Title */}
									<h3 className="text-sm md:text-lg text-primary uppercase tracking-wide font-medium" style={{ fontFamily: "var(--font-gilda)" }}>
										{item.title}
									</h3>

									{/* Description */}
									<p className="text-foreground-muted text-sm md:text-sm leading-relaxed">
										{item.description}
									</p>

									{/* Link */}
									<div className="text-primary font-medium text-xs sm:text-xs md:text-sm flex gap-1 sm:gap-2 group-hover:gap-3 transition-all items-center justify-center mt-1 sm:mt-2 md:mt-3">
										<span>{learnMoreText}</span>
										<span className="group-hover:translate-x-1 transition-transform">
											→
										</span>
									</div>
								</div>
							</div>
						</Card>
					</Link>
				</div>
			))}
		</div>
	);
}