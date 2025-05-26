export async function translateToHebrew(text: string): Promise<string> {
  try {
    const response = await fetch(`https://lingva.ml/api/v1/ru/he/${encodeURIComponent(text)}`);
    const data = await response.json();
    return data.translation || "⚠️ Translation failed";
  } catch (error) {
    console.error("Translation error:", error);
    return "⚠️ Error translating";
  }
} 