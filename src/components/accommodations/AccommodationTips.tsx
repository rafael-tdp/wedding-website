interface AccommodationTipsProps {
	title: string;
	tips: string[];
}

export default function AccommodationTips({
	title,
	tips,
}: AccommodationTipsProps) {
	return (
		<div className="border-l-4 border-primary bg-primary/5 rounded-r-lg p-6 space-y-3">
			<h3 className="font-semibold text-foreground">
				✓ {title}
			</h3>
			<ul className="space-y-2 text-foreground-muted text-sm">
				{tips.map((tip, index) => (
					<li key={index}>• {tip}</li>
				))}
			</ul>
		</div>
	);
}
