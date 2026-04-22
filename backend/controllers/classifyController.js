import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const ALLOWED_INTENTS = new Set([
  "cardiac_arrest",
  "bleeding",
  "unconscious",
  "choking",
  "unknown",
]);

const SYSTEM_PROMPT = `
You are an emergency classification assistant.

Your role is NOT to give medical advice.
Your ONLY task is to classify the situation into one of the following categories:

- cardiac_arrest
- bleeding
- unconscious
- choking
- unknown

Rules:
- Do NOT provide instructions
- Do NOT explain anything
- Only return JSON
- Be concise and accurate

Output format:
{
 "intent": "<one of the categories>",
 "confidence": <number between 0 and 1>
}
`;

export const classifyEmergency = async (req, res) => {
  const { text } = req.body;
  const audioFile = req.file;

  if (!text && !audioFile) {
    return res.status(400).json({ error: "Text or audio file is required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let result;
    if (audioFile) {
      result = await model.generateContent([
        SYSTEM_PROMPT,
        {
          inlineData: {
            data: audioFile.buffer.toString("base64"),
            mimeType: audioFile.mimetype || "audio/m4a",
          },
        },
        "Analyze this emergency audio and identify the intent.",
      ]);
    } else {
      result = await model.generateContent(
        SYSTEM_PROMPT + "\n\nInput: " + text,
      );
    }

    const response = await result.response;
    const aiText = response
      .text()
      .replace(/```json|```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = {
        intent: "unknown",
        confidence: 0.3,
      };
    }

    if (!ALLOWED_INTENTS.has(parsed.intent)) {
      parsed.intent = "unknown";
    }

    const confidence = Number(parsed.confidence);
    parsed.confidence = Number.isFinite(confidence)
      ? Math.max(0, Math.min(1, confidence))
      : 0.3;

    return res.json(parsed);
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      intent: "unknown",
      confidence: 0,
      error: error.message,
    });
  }
};
