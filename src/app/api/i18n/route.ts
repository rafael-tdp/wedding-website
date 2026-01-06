import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const locale = await getLocale();
    const dict = await getDictionary(locale);
    
    return NextResponse.json({ dict, locale });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 }
    );
  }
}
