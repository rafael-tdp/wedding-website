# 🤖 Automatic Translation with Gemini

This script uses Google Gemini API to automatically translate FAQ and Programme from French to Portuguese.

## 📋 Requirements

1. **Google Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Save as environment variable `GOOGLE_API_KEY`

2. **Install dependency**
   ```bash
   npm install @google/generative-ai
   ```

## 🚀 How to use

### 1. Configure environment variables

Add to your `.env.local` file:
```env
GOOGLE_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

### 2. Run the script

```bash
npm run translate:ai
```

## 📝 What the script does

1. **FAQ**
   - Fetches questions and answers without Portuguese translation
   - Translates each one with Gemini
   - Updates database with `question_pt` and `answer_pt`

2. **Programme**
   - Fetches titles and descriptions without Portuguese translation
   - Translates each one with Gemini
   - Updates database with `title_pt` and `description_pt`

## ⚙️ Features

- ✅ Automatic translation with AI
- ✅ Checks already translated records (doesn't retranslate)
- ✅ Pauses between requests to not overload API
- ✅ Visual feedback with icons and status
- ✅ Error handling

## 🔗 Expected output

```
🚀 Starting automatic translation with Gemini...

📚 Translating FAQ...
🔄 Found 3 FAQ(s) to translate...

📝 FAQ ID: abc123
  Translating question: "What is the wedding date?..."
  ✅ Question translated
  Translating answer: "The wedding is on August 15..."
  ✅ Answer translated

📅 Translating Programme...
🔄 Found 2 event(s) to translate...

🎉 Event ID: def456
  Translating title: "Ceremony"
  ✅ Title translated: "Cerimônia"

✅ Translation completed successfully!
```

## 🛑 Troubleshooting

- **Supabase authentication error**: Check if `SUPABASE_SERVICE_KEY` is correct
- **Gemini API error**: Check if `GOOGLE_API_KEY` is valid
- **No translations updated**: Check if there are records with null `question_pt` or `title_pt`

## 💡 Tips

- Run the script once to translate everything
- Subsequent runs only translate new records
- You can add more fields to translation by editing the script
