// Mock Resend email service
export class Resend {
  constructor(_apiKey: string) {}

  emails = {
    send: jest.fn().mockResolvedValue({ id: "mock-email-id" }),
  };
}
