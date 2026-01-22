"use client";

import InfoCards from "@/components/ui/InfoCards";
import { CiCalendar, CiForkAndKnife, CiMusicNote1 } from "react-icons/ci";
import { PiChatCenteredDots } from "react-icons/pi";

interface RSVPInfoCardsProps {
	dict: any;
}

export default function RSVPInfoCards({ dict }: RSVPInfoCardsProps) {
	const infoCards = [
		{
			icon: CiCalendar,
			title: dict.rsvp.deadline,
			description: dict.rsvp.deadlineText,
		},
		{
			icon: CiForkAndKnife,
			title: dict.rsvp.menu,
			description: dict.rsvp.menuText,
		},
		{
			icon: CiMusicNote1,
			title: dict.rsvp.music,
			description: dict.rsvp.musicText,
		},
		{
			icon: PiChatCenteredDots,
			title: dict.rsvp.questions,
			description: dict.rsvp.questionsText,
		},
	];

	return (
		<InfoCards 
			title={dict.rsvp.important}
			cards={infoCards}
			columns="2"
		/>	);
}