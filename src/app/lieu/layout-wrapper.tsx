import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import LieuPageContent from "./page";

export const metadata = {
  title: "Lieu & Accès - Notre Mariage",
  description: "Comment se rendre au lieu de notre mariage",
};

export default async function LieuPageWrapper() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return <LieuPageContent dict={dict} />;
}
