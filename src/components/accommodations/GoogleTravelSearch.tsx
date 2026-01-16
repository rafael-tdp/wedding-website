import { FaGoogle } from "react-icons/fa";
import { Button, Title } from "@/components/ui";

interface GoogleTravelSearchProps {
	title: string;
	description: string;
	buttonLabel: string;
	googleTravelLink: string;
}

export default function GoogleTravelSearch({
	title,
	description,
	buttonLabel,
	googleTravelLink,
}: GoogleTravelSearchProps) {
	return (
		<div className="space-y-6 sm:space-y-8">
			{/* Titre et description */}
			<div className="text-center space-y-2 sm:space-y-3">
				<Title level="h3" align="center">
					{title}
				</Title>
				<p className="text-base sm:text-lg text-foreground-muted px-2">{description}</p>
			</div>

			{/* Bouton principal */}
			<div className="flex justify-center">
				<a
					href={googleTravelLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						variant="primary"
						size="lg"
						className="inline-flex items-center gap-2 w-full sm:w-auto text-sm"
					>
						<FaGoogle className="w-5 h-5" />
						{buttonLabel}
					</Button>
				</a>
			</div>
		</div>
	);
}
