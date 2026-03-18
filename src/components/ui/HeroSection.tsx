import Section from "@/components/ui/Section";
import Title from "@/components/ui/Title";

interface HeroSectionProps {
	title: string;
	subtitle?: string;
	backgroundImage?: string;
	backgroundPosition?: string;
	withAccent?: boolean;
	withBackgroundLetter?: boolean;
}

export default function HeroSection({
	title,
	subtitle,
	backgroundImage,
	backgroundPosition = "center center",
	withAccent = false,
	withBackgroundLetter = true,
}: HeroSectionProps) {
	return (
		<Section
			variant="gradient"
			spacing="lg"
			isHero
			backgroundImage={backgroundImage}
			backgroundPosition={backgroundPosition}
		>
			<div className="text-center space-y-4 animate-slide-up">
				<Title
					level="h1"
					align="center"
					withAccent={withAccent}
					withBackgroundLetter={withBackgroundLetter}
					className="capitalize"
				>
					{title}
				</Title>
				{/* {subtitle && (
					<p className="text-normal md:text-lg text-foreground-muted mx-auto">
						{subtitle}
					</p>
				)} */}
			</div>
		</Section>
	);
}
