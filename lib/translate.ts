export async function translateToHebrew(text: string): Promise<string> {
  console.log("🌐 Translating:", text);

  try {
    const url = `https://translate.terraprint.co/api/v1/ru/he/${encodeURIComponent(text)}`;
    console.log("📤 Requesting:", url);

    const response = await fetch(url);
    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Bad HTTP status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Translation result:", data);

    return data.translation || "⚠️ Translation missing in response";
  } catch (error) {
    console.error("❌ Error during translation:", error);
    return "⚠️ Error translating";
  }
} 