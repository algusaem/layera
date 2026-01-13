// Mock bcryptjs
const bcrypt = {
  hash: jest.fn((password: string) => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password: string, hash: string) =>
    Promise.resolve(hash === `hashed_${password}` || password === "correctpassword")
  ),
};

export default bcrypt;
