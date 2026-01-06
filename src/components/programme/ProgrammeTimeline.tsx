import Section from "@/components/ui/Section";
import ProgrammeItem from "@/components/programme/ProgrammeItem";
import { Programme } from "@/lib/supabase/queries";

interface ProgrammeTimelineProps {
	items: Programme[];
	eventTranslations: any;
}

export default function ProgrammeTimeline({
	items,
	eventTranslations,
}: ProgrammeTimelineProps) {
	return (
		<Section variant="default" spacing="lg">
			<div className="max-w-6xl mx-auto px-4">
				<div className="relative">
					{items.map((item, index) => (
						<ProgrammeItem
							key={item.id}
							item={item}
							index={index}
							isLast={index === items.length - 1}
							eventTranslations={eventTranslations}
						/>
					))}
				</div>
			</div>
		</Section>
	);
}
