// Test data factories

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  password: "hashed_password123",
  role: "USER",
  createdAt: new Date("2025-01-01"),
  ...overrides,
});

export const createMockSession = (overrides: Partial<MockSession> = {}): MockSession => ({
  user: {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "USER",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
});

export const createMockAdminSession = (overrides: Partial<MockSession> = {}): MockSession => ({
  user: {
    id: "admin-1",
    email: "admin@example.com",
    name: "Admin User",
    role: "ADMIN",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  ...overrides,
});

export const createMockBrand = (overrides: Partial<MockBrand> = {}): MockBrand => ({
  id: "brand-1",
  name: "Test Brand",
  createdAt: new Date("2025-01-01"),
  ...overrides,
});

export const createMockPerfume = (overrides: Partial<MockPerfume> = {}): MockPerfume => ({
  id: "perfume-1",
  name: "Test Perfume",
  brandId: "brand-1",
  imageUrl: "https://res.cloudinary.com/test/layera/perfumes/test.jpg",
  status: "APPROVED",
  submittedBy: "user-1",
  createdAt: new Date("2025-01-01"),
  ...overrides,
});

export const createMockPerfumeWithBrand = (overrides: Partial<MockPerfumeWithBrand> = {}): MockPerfumeWithBrand => ({
  ...createMockPerfume(),
  brand: createMockBrand(),
  ...overrides,
});

export const createMockUserPerfume = (overrides: Partial<MockUserPerfume> = {}): MockUserPerfume => ({
  id: "user-perfume-1",
  userId: "user-1",
  perfumeId: "perfume-1",
  addedAt: new Date("2025-01-01"),
  notes: null,
  ...overrides,
});

export const createMockPasswordResetToken = (overrides: Partial<MockPasswordResetToken> = {}): MockPasswordResetToken => ({
  id: "token-1",
  token: "valid-reset-token",
  userId: "user-1",
  expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  createdAt: new Date(),
  ...overrides,
});

export const createMockPromptUsage = (overrides: Partial<MockPromptUsage> = {}): MockPromptUsage => ({
  id: "prompt-1",
  userId: "user-1",
  createdAt: new Date(),
  ...overrides,
});

export const createMockDbSession = (overrides: Partial<MockDbSession> = {}): MockDbSession => ({
  id: "session-1",
  sessionToken: "session-token",
  userId: "user-1",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  user: createMockUser(),
  ...overrides,
});

// Types
interface MockUser {
  id: string;
  email: string;
  name: string | null;
  password: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
}

interface MockSession {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: "USER" | "ADMIN";
  };
  expires: string;
}

interface MockBrand {
  id: string;
  name: string;
  createdAt: Date;
}

interface MockPerfume {
  id: string;
  name: string;
  brandId: string;
  imageUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedBy: string | null;
  createdAt: Date;
}

interface MockPerfumeWithBrand extends MockPerfume {
  brand: MockBrand;
}

interface MockUserPerfume {
  id: string;
  userId: string;
  perfumeId: string;
  addedAt: Date;
  notes: string | null;
}

interface MockPasswordResetToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

interface MockPromptUsage {
  id: string;
  userId: string;
  createdAt: Date;
}

interface MockDbSession {
  id: string;
  sessionToken: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  user: MockUser;
}
