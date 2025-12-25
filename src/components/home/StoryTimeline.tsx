"use client";

import { Dictionary } from "@/lib/i18n/get-dictionary";
import Title from "@/components/ui/Title";
import { useEffect, useRef, useState } from "react";

interface StoryTimelineProps {
	dict: Dictionary;
}

interface StoryItemProps {
	label: string;
	title: string;
	text: string;
	image: string;
	imageAlt: string;
	reversed?: boolean;
}

function StoryTimelineLabel({ label }: { label: string }) {
    return <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-2">{label}</p>;
}

function StoryTimelineImage({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="rounded-3xl overflow-hidden bg-gray-200 aspect-video">
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

function StoryTimelineText({ text }: { text: string }) {
    return <p className="text-foreground-muted leading-relaxed">{text}</p>;
}

function StoryItem({ label, title, text, image, imageAlt, reversed }: StoryItemProps) {
	const imageRef = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{ threshold: 0.1 }
		);

		if (imageRef.current) {
			observer.observe(imageRef.current);
		}

		return () => observer.disconnect();
	}, []);

	const animationClass = isVisible 
		? (reversed ? "animate-slide-in-right" : "animate-slide-in-left")
		: "opacity-0";

	return (
		<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
			<div className={reversed ? "order-2 md:order-1" : "order-2 md:order-2"}>
				<StoryTimelineLabel label={label} />
				<Title level="h4">{title}</Title>
				<StoryTimelineText text={text} />
			</div>
			<div ref={imageRef} className={`order-1 md:order-1 ${reversed ? "md:order-2" : ""} ${animationClass}`}>
				<StoryTimelineImage src={image} alt={imageAlt} />
			</div>
		</div>
	);
}

export function StoryTimeline({ dict }: StoryTimelineProps) {
	return (
		<div className="max-w-4xl mx-auto">
			{/* Titre et sous-titre */}
			<div className="text-center mb-16 pt-12">
				<Title level="h2" align="center" withAccent>
					{dict.home.story.title}
				</Title>
				{dict.home.story.subtitle && (
					<p className="text-foreground-muted text-sm mt-4">
						{dict.home.story.subtitle}
					</p>
				)}
			</div>

			{/* Timeline */}
			<div className="space-y-16">
				{/* Story Item 1 */}
				<StoryItem
					label={dict.home.story.meeting.label}
					title={dict.home.story.meeting.title}
					text={dict.home.story.meeting.text}
					image={dict.home.story.meeting.image || "/images/story-1.jpg"}
					imageAlt={dict.home.story.meeting.title}
					reversed={true}
				/>

                {/* Story Item 2 */}
				{dict.home.story.firstDate && (
					<StoryItem
						label={dict.home.story.firstDate.label}
						title={dict.home.story.firstDate.title}
						text={dict.home.story.firstDate.text}
						image={dict.home.story.firstDate.image || "/images/story-3.jpg"}
						imageAlt={dict.home.story.firstDate.title}
						reversed={false}
					/>
				)}

				{/* Story Item 3 */}
				<StoryItem
					label={dict.home.story.proposal.label}
					title={dict.home.story.proposal.title}
					text={dict.home.story.proposal.text}
					image={dict.home.story.proposal.image || "/images/story-2.jpg"}
					imageAlt={dict.home.story.proposal.title}
					reversed={true}
				/>

			</div>
		</div>
	);
}
