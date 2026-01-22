"use client";

import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { MdDirectionsCar, MdFlightTakeoff } from "react-icons/md";

interface LieuAccessModesProps {
	dict: any;
}

export default function LieuAccessModes({ dict }: LieuAccessModesProps) {
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
		<Section variant="soft" spacing="lg">
			<div 
				ref={containerRef}
				className="max-w-5xl mx-auto"
			>
				<div className={`text-center mb-12 transition-all duration-700 ${
					isVisible
						? "opacity-100 translate-y-0"
						: "opacity-0 translate-y-10"
				}`}>
					<h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-2">
						{dict.venue.howToGetThere || "Comment s'y rendre ?"}
					</h2>
					<p className="text-foreground-muted text-sm sm:text-base">
						{dict.venue.chooseYourTransport || "Plusieurs options de transport s'offrent à vous."}
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
					<div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}>
						<Card variant="default" className="h-full">
							<div className="flex flex-col justify-center text-center space-y-4">
								<div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
									<MdDirectionsCar className="w-7 sm:w-8 h-7 sm:h-8 text-primary" />
								</div>
								<div>
									<h3 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
										{dict.venue.byCar}
									</h3>
									<p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
										{dict.venue.byCarText}
									</p>
								</div>
							</div>
						</Card>
					</div>

					<div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: isVisible ? "100ms" : "0ms" }}>
						<Card variant="default" className="h-full">
							<div className="flex flex-col justify-center text-center space-y-4">
								<div className="w-14 sm:w-16 h-14 sm:h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
									<MdFlightTakeoff className="w-7 sm:w-8 h-7 sm:h-8 text-accent" />
								</div>
								<div>
									<h3 className="text-xl sm:text-2xl font-serif text-foreground mb-2">
										{dict.venue.byPlane}
									</h3>
									<p className="text-sm sm:text-base text-foreground-muted whitespace-pre-line">
										{dict.venue.byPlaneText}
									</p>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</Section>
	);
}