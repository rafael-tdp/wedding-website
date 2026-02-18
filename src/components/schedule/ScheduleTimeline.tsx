import Section from "@/components/ui/Section";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import { Programme } from "@/lib/supabase/queries";

interface ScheduleTimelineProps {
	items: Programme[];
}

export default function ScheduleTimeline({
	items,
}: ScheduleTimelineProps) {
	return (
		<Section variant="default" spacing="lg">
			<div className="max-w-6xl mx-auto">
				<div className="relative">
					{items.map((item: Programme, index: number) => (
						<ScheduleItem
							key={item.id}
							item={item}
							index={index}
							isFirst={index === 0}
							isLast={index === items.length - 1}
						/>
					))}
				</div>
			</div>
		</Section>
	);
}
