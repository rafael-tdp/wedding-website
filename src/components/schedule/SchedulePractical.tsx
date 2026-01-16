import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Title } from "../ui";

interface SchedulePracticalProps {
	title: string;
	description: string;
	venueButtonLabel: string;
	accommodationButtonLabel: string;
}

/**
 * Composant : Section Pratique du Programme
 */
export default function SchedulePractical({
	title,
	description,
	venueButtonLabel,
	accommodationButtonLabel,
}: SchedulePracticalProps) {
	return (
		<Section variant="soft" spacing="md">
			<div className="max-w-2xl mx-auto text-center space-y-4 px-3 sm:px-4">
				<Title level="h2" align="center" withAccent>
					{title}
				</Title>
				<p className="text-foreground-muted">{description}</p>
				<div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4">
					<Link href="/location" className="w-full sm:w-auto">
						<Button
							variant="primary"
							size="lg"
							className="w-full sm:w-auto"
						>
							{venueButtonLabel}
						</Button>
					</Link>
					<Link href="/accommodations" className="w-full sm:w-auto">
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto"
						>
							{accommodationButtonLabel}
						</Button>
					</Link>
				</div>
			</div>
		</Section>
	);
}
