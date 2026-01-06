import Hero from "@/components/home/Hero";
import CountdownSection from "@/components/home/CountdownSection";
import StorySection from "@/components/home/StorySection";
import PracticalSection from "@/components/home/PracticalSection";
import CTASection from "@/components/home/CTASection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";

export default async function Home() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen animate-page-enter">
      <Hero dict={dict} />
      <CountdownSection dict={dict} />
      <StorySection dict={dict} />
      <PracticalSection dict={dict} />
      <CTASection dict={dict} />
    </main>
  );
}
