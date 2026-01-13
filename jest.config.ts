import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // External library mocks (prisma and auth are mocked in jest.setup.ts)
    "^cloudinary$": "<rootDir>/__mocks__/cloudinary.ts",
    "^bcryptjs$": "<rootDir>/__mocks__/bcryptjs.ts",
    "^resend$": "<rootDir>/__mocks__/resend.ts",
    "^@google/generative-ai$": "<rootDir>/__mocks__/@google/generative-ai.ts",
    // General @ alias pattern comes last
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/__tests__/utils/",
  ],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  transformIgnorePatterns: [
    "/node_modules/(?!(@auth|next-auth)/)",
  ],
};

export default createJestConfig(config);
