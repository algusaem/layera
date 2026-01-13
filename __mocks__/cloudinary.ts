// Mock Cloudinary v2
interface UploadCallback {
  (err: Error | null, result: { secure_url: string } | null): void;
}

const createMockUploadStream = () => {
  let callback: UploadCallback | null = null;

  return {
    end: jest.fn(() => {
      // Trigger callback when end is called
      if (callback) {
        callback(null, { secure_url: "https://res.cloudinary.com/test/layera/perfumes/test123.jpg" });
      }
    }),
    setCallback: (cb: UploadCallback) => {
      callback = cb;
    },
  };
};

const mockUploadStreamFn = jest.fn((_options: unknown, cb: UploadCallback) => {
  const stream = createMockUploadStream();
  stream.setCallback(cb);
  return stream;
});

const mockDestroy = jest.fn().mockResolvedValue({ result: "ok" });

export const v2 = {
  config: jest.fn(),
  uploader: {
    upload_stream: mockUploadStreamFn,
    destroy: mockDestroy,
  },
};

// Default export for compatibility
export default { v2 };
