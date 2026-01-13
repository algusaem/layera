// Mock Google Generative AI
export class GoogleGenerativeAI {
  constructor(_apiKey: string) {}

  getGenerativeModel = jest.fn(() => ({
    startChat: jest.fn(() => ({
      sendMessage: jest.fn().mockResolvedValue({
        response: {
          text: () => "This is a mock AI response about fragrances.",
        },
      }),
    })),
  }));
}
