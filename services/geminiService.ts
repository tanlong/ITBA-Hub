
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAIQuestions(topic: string, count: number = 10) {
  const prompt = `You are an expert IT Business Analyst (ITBA) and Project Manager, deeply familiar with BABOK v3 and practical industry experience. 
  Generate ${count} high-quality multiple-choice questions about the topic: "${topic}".
  
  Guidelines:
  1. Maintain technical terms in English (e.g., Stakeholder, Requirement, Backlog, Elicitation, Use Case, etc.) even in Vietnamese descriptions.
  2. Each question must have exactly 4 options.
  3. MANDATORY: The explanation for the correct answer MUST BE DETAILED, between 200-300 words per question. 
     The explanation must be structured as follows:
     - Theoretical Context: Reference specific BABOK concepts.
     - Correct Answer Justification: Why this choice is the industry standard.
     - Distractor Analysis: Briefly explain why the other 3 options are incorrect or less optimal.
     - Practical Scenario: A real-world example of this concept in action.
  4. Provide content in both English and Vietnamese.
  5. The Vietnamese translation should be professional and retain technical ITBA jargon in English.
  
  Return the result in JSON format matching this schema:
  Array of {
    id: string (unique),
    questionEn: string,
    questionVi: string,
    optionsEn: string[] (length 4),
    optionsVi: string[] (length 4),
    correctAnswerIndex: number (0-3),
    explanationEn: string,
    explanationVi: string
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            questionEn: { type: Type.STRING },
            questionVi: { type: Type.STRING },
            optionsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
            optionsVi: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.NUMBER },
            explanationEn: { type: Type.STRING },
            explanationVi: { type: Type.STRING },
          },
          required: ['id', 'questionEn', 'questionVi', 'optionsEn', 'optionsVi', 'correctAnswerIndex', 'explanationEn', 'explanationVi'],
        },
      },
    },
  });

  try {
    const jsonStr = response.text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}
