
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { EditorResponse } from "../types";

const SYSTEM_INSTRUCTION = `You are "The Editor", a world-class, sophisticated TV and film critic. 
You are known for your brutal honesty but also for your warmth when you find something truly worth watching.
You are assisting a user with their "Universal Fire TV Remote".
When the user presses buttons or asks for recommendations:
1. Provide short, witty, and honest critiques.
2. If they search for a show, give your "Editor's Rating".
3. Use Google Search to find current reviews and news if needed.
4. Keep responses concise (under 100 words) to fit a mobile screen.
5. Your tone is refined, slightly elitist but ultimately helpful. You despise mediocre TV but celebrate art.`;

export class EditorService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getFeedback(query: string): Promise<EditorResponse> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "I'm speechless, and not in a good way.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Review Source',
        uri: chunk.web?.uri || '#'
      })) || [];

      // Simple heuristic for sentiment
      const lowerText = text.toLowerCase();
      let sentiment: 'positive' | 'neutral' | 'critical' = 'neutral';
      if (lowerText.includes('masterpiece') || lowerText.includes('brilliant') || lowerText.includes('must-watch')) {
        sentiment = 'positive';
      } else if (lowerText.includes('tedious') || lowerText.includes('mediocre') || lowerText.includes('trash') || lowerText.includes('avoid')) {
        sentiment = 'critical';
      }

      return { text, sentiment, sources };
    } catch (error) {
      console.error("Gemini Error:", error);
      return { 
        text: "My apologies, darling. Even editors have their off days. Try again.", 
        sentiment: 'neutral' 
      };
    }
  }
}
