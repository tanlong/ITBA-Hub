import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// 1. SỬA QUAN TRỌNG: Dùng import.meta.env và tên biến có VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Kiểm tra an toàn để tránh crash ứng dụng nếu quên set key
if (!apiKey) {
  console.error("❌ CRITICAL: Missing VITE_GEMINI_API_KEY in .env or Vercel Settings");
}

// Khởi tạo client an toàn
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });

export async function generateAIQuestions(topic: string, count: number = 10) {
  // Check key trước khi gọi để tránh lỗi ngầm
  if (!apiKey) throw new Error("API Key is missing. Please check configuration.");

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
    // LƯU Ý: Đổi model về bản ổn định (gemini-1.5-flash) hoặc mới nhất (gemini-2.0-flash-exp)
    // "gemini-3" hiện tại chưa hoạt động ổn định hoặc chưa public public API
    model: 'gemini-1.5-flash', 
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
    const jsonStr = response.text(); // Lưu ý: response.text() là hàm, hoặc response.text tùy version SDK
    // Với SDK @google/genai mới nhất thì response.text() là hàm, nhưng kiểm tra kỹ type trả về
    return JSON.parse(jsonStr || "[]");
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

export async function chatWithAI(history: ChatMessage[], message: string, language: string) {
  if (!apiKey) return "Error: API Key is missing configuration.";

  const systemInstruction = `You are a Senior IT Business Analyst (ITBA) Expert and Mentor. 
  Your expertise includes BABOK v3, SDLC, Agile (Scrum/Kanban), UML, BPMN, and stakeholder management.
   
  Rules:
  1. Always provide professional, practical, and highly detailed answers.
  2. Use technical ITBA terms in English (e.g., User Story, Acceptance Criteria, Elicitation, Stakeholder, Non-functional Requirements) regardless of the language used for the rest of the response.
  3. If the user asks in Vietnamese, reply in Vietnamese but keep technical jargon in English.
  4. Structure your answers with headings, bullet points, and practical examples where possible.
  5. Your tone should be supportive, authoritative, and educational.
  6. Current language context: ${language === 'en' ? 'English' : 'Vietnamese'}.`;

  const contents = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await ai.models.generateContent({
    // Tương tự, dùng model ổn định
    model: 'gemini-1.5-pro', 
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
      topP: 0.95,
    },
  });

  return response.text() || "I'm sorry, I couldn't process that request.";
}
