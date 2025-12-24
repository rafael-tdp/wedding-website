/**
 * SCRIPT: Automatic Translation with Gemini
 * 
 * Uses Google Gemini API to automatically translate:
 * - FAQ (questions and answers)
 * - Programme (titles and descriptions)
 * 
 * Usage:
 * npm run translate:ai
 * 
 * Required environment variables:
 * - GOOGLE_API_KEY : Google Gemini API key
 * - NEXT_PUBLIC_SUPABASE_URL : Supabase URL
 * - SUPABASE_SERVICE_KEY : Supabase service key
 */

require("dotenv").config({ path: ".env.local" });

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

// ============================================
// CONFIGURATION
// ============================================

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!GOOGLE_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing environment variables:");
  console.error("   - GOOGLE_API_KEY");
  console.error("   - NEXT_PUBLIC_SUPABASE_URL");
  console.error("   - SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// FUNCTIONS
// ============================================

/**
 * Translates multiple texts at once from French to Portuguese using Gemini
 * Returns object with same keys as input, containing translations
 */
async function translateBatch(textObj) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Format texts for batch translation
    const textLines = Object.entries(textObj)
      .map(([key, text]) => `[${key}]\n${text}`)
      .join("\n\n");

    const prompt = `Translate the following texts from French to Portuguese (Portugal, choose the most natural).
Maintain the same format with [key] labels:

${textLines}

Return ONLY the translated texts with [key] labels, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    // Parse response back into object
    const translations = {};
    const lines = translatedText.split("\n");
    let currentKey = null;
    let currentText = [];

    for (const line of lines) {
      const keyMatch = line.match(/^\[(.+)\]$/);
      if (keyMatch) {
        if (currentKey) {
          translations[currentKey] = currentText.join("\n").trim();
        }
        currentKey = keyMatch[1];
        currentText = [];
      } else if (currentKey) {
        currentText.push(line);
      }
    }

    if (currentKey) {
      translations[currentKey] = currentText.join("\n").trim();
    }

    return translations;
  } catch (error) {
    console.error(`Error translating: ${error.message}`);
    return null;
  }
}

/**
 * Translates FAQ in batch
 */
async function translateFAQ() {
  console.log("\n📚 Translating FAQ...");

  const { data: faqs, error } = await supabase
    .from("faq")
    .select("id, question_fr, answer_fr, category_fr, question_pt, answer_pt, category_pt");

  if (error) {
    console.error("Error fetching FAQ:", error);
    return;
  }

  // Filtrer les FAQs qui nécessitent une traduction
  const faqsToTranslate = faqs.filter(faq => 
    !faq.question_pt || !faq.answer_pt || (faq.category_fr && !faq.category_pt)
  );

  if (faqsToTranslate.length === 0) {
    console.log("✅ All FAQ are already translated!");
    return;
  }

  console.log(`🔄 Found ${faqsToTranslate.length} FAQ(s) to translate...`);

  // Prepare batch translation object
  const textsToBatch = {};
  const faqMapping = {};

  for (const faq of faqsToTranslate) {
    if (!faq.question_pt) {
      const key = `faq_${faq.id}_q`;
      textsToBatch[key] = faq.question_fr;
      faqMapping[key] = { faqId: faq.id, field: "question_pt" };
    }
    if (!faq.answer_pt) {
      const key = `faq_${faq.id}_a`;
      textsToBatch[key] = faq.answer_fr;
      faqMapping[key] = { faqId: faq.id, field: "answer_pt" };
    }
    if (faq.category_fr && !faq.category_pt) {
      const key = `faq_${faq.id}_c`;
      textsToBatch[key] = faq.category_fr;
      faqMapping[key] = { faqId: faq.id, field: "category_pt" };
    }
  }

  if (Object.keys(textsToBatch).length === 0) {
    console.log("✅ All FAQ are already translated!");
    return;
  }

  // Translate all at once
  console.log(`📤 Sending ${Object.keys(textsToBatch).length} texts to Gemini...`);
  const translations = await translateBatch(textsToBatch);

  if (!translations) {
    console.error("❌ Batch translation failed");
    return;
  }

  // Update database with translations
  for (const [key, translation] of Object.entries(translations)) {
    const mapping = faqMapping[key];
    if (mapping) {
      const { error: updateError } = await supabase
        .from("faq")
        .update({ [mapping.field]: translation })
        .eq("id", mapping.faqId);

      if (updateError) {
        console.error(`❌ Error updating FAQ ${mapping.faqId}: ${updateError.message}`);
      } else {
        console.log(`✅ FAQ ${mapping.faqId} (${mapping.field}) updated`);
      }
    }
  }
}

/**
 * Translates Accommodations in batch
 */
async function translateHebergements() {
  console.log("\n🏨 Translating Accommodations...");

  const { data: hebergements, error } = await supabase
    .from("hebergements")
    .select("id, name_fr, description_fr, price_note_fr, name_pt, description_pt, price_note_pt");

  if (error) {
    console.error("Error fetching Accommodations:", error);
    return;
  }

  // Filtrer les accommodations qui nécessitent une traduction
  const hebsToTranslate = hebergements.filter(heb =>
    !heb.name_pt || !heb.description_pt || (heb.price_note_fr && !heb.price_note_pt)
  );

  if (hebsToTranslate.length === 0) {
    console.log("✅ All accommodations are already translated!");
    return;
  }

  console.log(`🔄 Found ${hebsToTranslate.length} accommodation(s) to translate...`);

  // Prepare batch translation object
  const textsToBatch = {};
  const hebMapping = {};

  for (const heb of hebsToTranslate) {
    if (!heb.name_pt) {
      const key = `heb_${heb.id}_n`;
      textsToBatch[key] = heb.name_fr;
      hebMapping[key] = { hebId: heb.id, field: "name_pt" };
    }
    if (heb.description_fr && !heb.description_pt) {
      const key = `heb_${heb.id}_d`;
      textsToBatch[key] = heb.description_fr;
      hebMapping[key] = { hebId: heb.id, field: "description_pt" };
    }
    if (heb.price_note_fr && !heb.price_note_pt) {
      const key = `heb_${heb.id}_p`;
      textsToBatch[key] = heb.price_note_fr;
      hebMapping[key] = { hebId: heb.id, field: "price_note_pt" };
    }
  }

  if (Object.keys(textsToBatch).length === 0) {
    console.log("✅ All accommodations are already translated!");
    return;
  }

  // Translate all at once
  console.log(`📤 Sending ${Object.keys(textsToBatch).length} texts to Gemini...`);
  const translations = await translateBatch(textsToBatch);

  if (!translations) {
    console.error("❌ Batch translation failed");
    return;
  }

  // Update database with translations
  for (const [key, translation] of Object.entries(translations)) {
    const mapping = hebMapping[key];
    if (mapping) {
      const { error: updateError } = await supabase
        .from("hebergements")
        .update({ [mapping.field]: translation })
        .eq("id", mapping.hebId);

      if (updateError) {
        console.error(`❌ Error updating Accommodation ${mapping.hebId}: ${updateError.message}`);
      } else {
        console.log(`✅ Accommodation ${mapping.hebId} (${mapping.field}) updated`);
      }
    }
  }
}

/**
 * Translates Programme in batch
 */
async function translateProgramme() {
  console.log("\n📅 Translating Programme...");

  const { data: programmes, error } = await supabase
    .from("programme")
    .select("id, title_fr, description_fr, title_pt, description_pt");

  if (error) {
    console.error("Error fetching Programme:", error);
    return;
  }

  // Filtrer les programmes qui nécessitent une traduction
  const progsToTranslate = programmes.filter(prog =>
    !prog.title_pt || !prog.description_pt
  );

  if (progsToTranslate.length === 0) {
    console.log("✅ All events are already translated!");
    return;
  }

  console.log(`🔄 Found ${progsToTranslate.length} event(s) to translate...`);

  // Prepare batch translation object
  const textsToBatch = {};
  const progMapping = {};

  for (const prog of progsToTranslate) {
    if (!prog.title_pt) {
      const key = `prog_${prog.id}_t`;
      textsToBatch[key] = prog.title_fr;
      progMapping[key] = { progId: prog.id, field: "title_pt" };
    }
    if (prog.description_fr && !prog.description_pt) {
      const key = `prog_${prog.id}_d`;
      textsToBatch[key] = prog.description_fr;
      progMapping[key] = { progId: prog.id, field: "description_pt" };
    }
  }

  if (Object.keys(textsToBatch).length === 0) {
    console.log("✅ All Programme are already translated!");
    return;
  }

  // Translate all at once
  console.log(`📤 Sending ${Object.keys(textsToBatch).length} texts to Gemini...`);
  const translations = await translateBatch(textsToBatch);

  if (!translations) {
    console.error("❌ Batch translation failed");
    return;
  }

  // Update database with translations
  for (const [key, translation] of Object.entries(translations)) {
    const mapping = progMapping[key];
    if (mapping) {
      const { error: updateError } = await supabase
        .from("programme")
        .update({ [mapping.field]: translation })
        .eq("id", mapping.progId);

      if (updateError) {
        console.error(`❌ Error updating Programme ${mapping.progId}: ${updateError.message}`);
      } else {
        console.log(`✅ Programme ${mapping.progId} (${mapping.field}) updated`);
      }
    }
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log("🚀 Starting automatic translation with Gemini...\n");

  try {
    await translateFAQ();
    await translateProgramme();
    await translateHebergements();

    console.log("\n✅ Translation completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

main();
