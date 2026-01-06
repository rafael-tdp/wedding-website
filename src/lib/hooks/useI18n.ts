import { useEffect, useState } from "react";

interface I18nData {
  dict: any;
  locale: string;
}

export function useI18n() {
  const [data, setData] = useState<I18nData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchI18n = async () => {
      try {
        const response = await fetch("/api/i18n");
        const { dict, locale } = await response.json();
        setData({ dict, locale });
      } catch (error) {
        console.error("Failed to fetch i18n data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchI18n();
  }, []);

  return { data, isLoading };
}
