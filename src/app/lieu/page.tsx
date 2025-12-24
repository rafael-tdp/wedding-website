import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import LieuPageClient from "./client";

export const metadata = {
  title: "Lieu & Accès - Notre Mariage",
  description: "Comment se rendre au lieu de notre mariage",
};

export default async function LieuPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return <LieuPageClient dict={dict} />;
}
