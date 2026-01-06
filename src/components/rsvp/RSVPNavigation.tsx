"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

interface RSVPNavigationProps {
	dict: any;
}

export default function RSVPNavigation({ dict }: RSVPNavigationProps) {
	return (
		<div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap pt-12">
			<Link href="/programme" className="w-full sm:w-auto">
				<Button
					variant="primary"
					size="lg"
					className="w-full sm:w-auto"
				>
					{dict.rsvp.seeProgramme}
				</Button>
			</Link>
			<Link href="/hebergements" className="w-full sm:w-auto">
				<Button
					variant="outline"
					size="lg"
					className="w-full sm:w-auto"
				>
					{dict.rsvp.seeAccommodation}
				</Button>
			</Link>
		</div>
	);
}
