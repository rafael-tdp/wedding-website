import Section from "@/components/ui/Section";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import { Programme } from "@/lib/supabase/queries";

interface ScheduleTimelineProps {
	items: Programme[];
	eventTranslations: any;
}

export default function ScheduleTimeline({
	items,
	eventTranslations,
}: ScheduleTimelineProps) {
	return (
		<Section variant="default" spacing="lg">
			<div className="max-w-6xl mx-auto px-4">
				<div className="relative">
					{items.map((item: Programme, index: number) => (
						<ScheduleItem
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
