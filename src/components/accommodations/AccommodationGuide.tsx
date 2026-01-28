'use client';

import { Title } from "../ui";
import { useEffect, useRef, useState } from "react";

interface AccommodationGuideStep {
	title: string;
	description: string;
	tip?: string;
}

interface AccommodationGuideProps {
	title: string;
	steps: AccommodationGuideStep[];
}

export default function AccommodationGuide({
	title,
	steps,
}: AccommodationGuideProps) {
	return (
		<div className="border-l-4 border-primary bg-primary/5 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
			<h4 className="font-normal text-foreground text-lg sm:text-xl mb-0.5 sm:mb-1 font-sans">
				{title}
			</h4>

			<div className="space-y-4 sm:space-y-6">
				{steps.map((step, index) => (
					<div key={index}>
						<StepItem step={step} index={index} />
						<div
							className={`border-t border-primary/20 mt-4 ${
								index === steps.length - 1 ? "hidden" : ""
							}`}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

function StepItem({ step, index }: { step: AccommodationGuideStep; index: number }) {
	const itemRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
						if (itemRef.current) {
							observer.unobserve(itemRef.current);
						}
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (itemRef.current) {
			observer.observe(itemRef.current);
		}

		return () => {
			if (itemRef.current) {
				observer.unobserve(itemRef.current);
			}
		};
	}, []);

	return (
		<div
			ref={itemRef}
			className={`transition-all duration-700 ${
				isVisible
					? "opacity-100 translate-x-0"
					: "opacity-0 -translate-x-10"
			}`}
		>
			<div className="flex gap-2 sm:gap-4">
				<div className="flex-shrink-0">
					<div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary text-white font-semibold text-xs sm:text-sm">
						{index + 1}
					</div>
				</div>
				<div className="flex-grow">
					<h4 className="font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1 font-sans">
						{step.title}
					</h4>
					<p className="text-foreground-muted text-sm sm:text-base">
						{step.description}
					</p>
					{step.tip && (
						<p className="text-xs text-foreground-muted mt-1 sm:mt-2">
							💡 {step.tip}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
