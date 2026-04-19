import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY, {
  apiVersion: "v1beta",
});

const SYSTEM_PROMPT = `
You are an emergency classification assistant.

Your role is NOT to give medical advice.
Your ONLY task is to classify the situation into one of the following categories:

- cardiac_arrest
- bleeding
- unconscious
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

/**
 * @swagger
 * /classify:
 *   post:
 *     summary: Classify an emergency situation from text or audio
 *     description: Analyzes either the provided text or an uploaded audio file and classifies it into one of the known emergency categories.
 *     responses:
 *       200:
 *         description: Successful classification
 */
router.post("/", upload.single("audio"), async (req, res) => {
  const { text } = req.body;
  const audioFile = req.file;

  if (!text && !audioFile) {
    return res.status(400).json({ error: "Text or audio file is required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-robotics-er-1.5-preview",
    });

    let result;
    if (audioFile) {
      // Processing audio with Gemini Pro 1.5 Flash
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
      // Processing text
      result = await model.generateContent(
        SYSTEM_PROMPT + "\n\nInput: " + text,
      );
    }

    const response = await result.response;
    const aiText = response.text();

    // Extract JSON from potential Markdown formatting
    const cleanedText = aiText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      parsed = {
        intent: "unknown",
        confidence: 0.3,
      };
    }

    return res.json(parsed);
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({
      intent: "unknown",
      confidence: 0,
      error: error.message,
    });
  }
});

export default router;
