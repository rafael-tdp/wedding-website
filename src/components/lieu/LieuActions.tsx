import Link from "next/link";
import Button from "@/components/ui/Button";

interface LieuActionsProps {
	dict: any;
}

export default function LieuActions({ dict }: LieuActionsProps) {
	return (
		<div className="flex flex-col sm:flex-row px-8 sm:px-4 gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-4 pb-16 sm:pb-20 2xl:pb-24">
			<Link href="/programme">
				<Button
					variant="primary"
					size="lg"
					className="w-full sm:w-auto"
				>
					{dict.venue.seeProgramme}
				</Button>
			</Link>
			<Link href="/hebergements">
				<Button
					variant="outline"
					size="lg"
					className="w-full sm:w-auto"
				>
					{dict.venue.seeAccommodation}
				</Button>
			</Link>
		</div>
	);
}
