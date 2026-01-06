"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import {
	MdLocalOffer,
	MdDirectionsCar,
	MdLocationOn,
	MdQuestionAnswer,
} from "react-icons/md";
import { Title } from "../ui";

interface HebergementPracticalTipsProps {
	dict: any;
}

export default function HebergementPracticalTips({
	dict,
}: HebergementPracticalTipsProps) {
	const tips = [
		{
			icon: MdLocalOffer,
			title: dict.accommodation.bookEarly.title,
			description: dict.accommodation.bookEarly.description,
		},
		{
			icon: MdDirectionsCar,
			title: dict.accommodation.carpooling.title,
			description: dict.accommodation.carpooling.description,
		},
		{
			icon: MdLocationOn,
			title: dict.accommodation.distance.title,
			description: dict.accommodation.distance.description,
		},
		{
			icon: MdQuestionAnswer,
			title: dict.accommodation.questions.title,
			description: dict.accommodation.questions.description,
		},
	];

	return (
		<Section variant="soft" spacing="lg">
			<div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 px-4 sm:px-0">
				<Title level="h2" align="center" withAccent>
					{dict.accommodation.practicalTips}
				</Title>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
					{tips.map((tip, index) => {
						const Icon = tip.icon;
						return (
							<div
								key={index}
								className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200"
							>
								<div className="flex items-start gap-3 sm:gap-4">
									<div className="text-2xl sm:text-3xl flex-shrink-0 text-primary">
										<Icon />
									</div>
									<div className="flex-grow">
										<h3 className="text-base sm:text-lg font-serif text-foreground mb-1 sm:mb-2">
											{tip.title}
										</h3>
										<p className="text-foreground-muted text-xs sm:text-sm">
											{tip.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				<div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4">
					<Link href="/lieu" className="w-full sm:w-auto">
						<Button
							variant="primary"
							size="lg"
							className="w-full sm:w-auto"
						>
							{dict.accommodation.seeVenue}
						</Button>
					</Link>
					<Link href="/programme" className="w-full sm:w-auto">
						<Button
							variant="outline"
							size="lg"
							className="w-full sm:w-auto"
						>
							{dict.accommodation.seeProgramme}
						</Button>
					</Link>
				</div>
			</div>
		</Section>
	);
}
