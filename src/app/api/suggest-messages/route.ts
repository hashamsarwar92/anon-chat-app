import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

    // Ensure prompt is provided
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Instantiate Google GenAI client with the API key stored in environment variable
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,  // Load your API key from environment variables
    });

    // Call the Gemini model to generate content
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Return the generated content
    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Error with Gemini API call:', error);
    return NextResponse.json({ error: 'Failed to call Gemini API' }, { status: 500 });
  }
}
