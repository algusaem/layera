"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function sendMessage(messages: Message[], newMessage: string) {
  if (!newMessage.trim()) {
    return { error: "Message cannot be empty" };
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return { error: "API key not configured" };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-pro-preview",
      systemInstruction: `You are a helpful fragrance expert assistant for Layera, a fragrance layering website.
Your role is to help users discover and understand perfumes, provide recommendations for layering fragrances,
and answer questions about scents, notes, brands, and fragrance combinations.
Be friendly, knowledgeable, and concise in your responses. Refuse to answer questions outside the domain of fragrances.`
    });

    // Build conversation history for context
    const history = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(newMessage);
    const response = result.response.text();

    return { response };
  } catch (error) {
    const err = error as { message?: string; status?: number; statusText?: string };
    console.error("Gemini API error details:", {
      message: err?.message,
      status: err?.status,
      statusText: err?.statusText,
      error: error,
    });
    return { error: `Failed to get response: ${err?.message || "Unknown error"}` };
  }
}
