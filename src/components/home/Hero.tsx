import Link from "next/link";
import Button from "@/components/ui/Button";

interface HeroProps {
	dict: any;
}

export default function Hero({ dict }: HeroProps) {
	return (
		<>
			{/* Hero Section */}
			<div
				className="relative w-full min-h-screen bg-cover bg-center sm:bg-fixed flex flex-col items-center justify-end overflow-hidden"
				style={{
					backgroundImage:
						"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/hero-bg.jpeg')",
					backgroundPosition: "center center",
					backgroundSize: "cover",
				}}
			>
				<div className="text-center w-full space-y-6 sm:space-y-8 text-white pb-24 md:pb-32 max-w-3xl animate-slide-up">
					{/* Deskstop title */}
					<h1
						className="hidden sm:block text-6xl sm:text-7xl md:text-8xl font-serif italic font-extralight leading-none"
						style={{ fontFamily: "var(--font-parisienne)" }}
					>
						{dict.home.hero.title}
					</h1>
					{/* Mobile title */}
					<h1
						className="sm:hidden w-full text-7xl font-serif italic font-extralight leading-[0.6]"
						style={{ fontFamily: "var(--font-parisienne)" }}
					>
						{dict.home.hero.title
							.split(" ")
							.map((word: string, index: number) => (
								<span
									key={index}
									className={
										index === 1 ? "text-3xl block" : "block"
									}
								>
									{word}
								</span>
							))}
					</h1>

					{/* Space */}
					<div className="h-48 sm:h-48 2xl:h-64 w-full"></div>

					{/* Details */}
					<div className="space-y-1 text-gray-200">
						<p className="text-sm md:text-base font-serif italic">
							{dict.home.hero.subtitle}
						</p>
						<p className="text-sm text-gray-300">
							{dict.home.hero.date}
						</p>
					</div>

					{/* Vertical line */}
					<div className="flex justify-center my-2">
						<div className="h-8 w-[1px] bg-white"></div>
					</div>

					{/* Button */}
					<div className="flex justify-center">
						<Link href="/rsvp" className="w-auto">
							<Button
								variant="primary"
								size="lg"
								className="w-full sm:w-auto text-xxs border-none"
							>
								{dict.home.hero.confirmPresence}
							</Button>
						</Link>
					</div>
				</div>

				{/* <svg
					className="absolute bottom-0 left-0 w-full"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					style={{ marginBottom: "-1px" }}
				>
					<path
						d="M 0,120 Q 600,20 1200,120 L 1200,120 L 0,120 Z"
						className="fill-background-soft"
					/>
				</svg> */}
			</div>
		</>
	);
}
