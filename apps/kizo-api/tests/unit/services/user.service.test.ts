import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "../../../src/services/user.service";
import { userRepository } from "@kizo/db";
import * as tokenUtils from "../../../src/utils/tokens";

// mocks
vi.mock("../../src/repositories/user.repository");
vi.mock("../../src/utils/tokens");
vi.mock("sharp", () => ({
  default: vi.fn(() => sharpMock),
}));
vi.mock("../../../src/lib/storage", () => ({
  getSupabase: vi.fn(() => ({
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi
        .fn()
        .mockReturnValue({ data: { publicUrl: "http://avatar.url" } }),
    },
  })),
}));
vi.mock("../../../src/utils/tokens", () => ({
  signAccessToken: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

const service = new UserService();
const sharpMock = {
  resize: vi.fn().mockReturnThis(),
  webp: vi.fn().mockReturnThis(),
  toBuffer: vi.fn().mockResolvedValue(Buffer.from("optimized")),
};
const mockLog = { info: vi.fn(), warn: vi.fn(), error: vi.fn() } as any;

describe("UserService.updateProfile", () => {
  beforeEach(() => {
    vi.mocked(userRepository.updateUser).mockResolvedValue({
      id: "user-id",
    } as any);
    vi.mocked(tokenUtils.signAccessToken).mockReturnValue("new-token");
  });

  it("updates user and returns new token", async () => {
    const updatedUser = { id: "user-id", email: "test@test.com" };
    vi.mocked(userRepository.updateUser).mockResolvedValue(updatedUser as any);
    await service.updateProfile("user-id", { firstName: "NewName" });
  });

  it("updates only provided fields", async () => {
    await service.updateProfile("user-id", {
      firstName: "Aman",
    });

    expect(userRepository.updateUser).toHaveBeenCalledWith("user-id", {
      firstName: "Aman",
    });
  });
});

describe("UserService.uploadAvatar", () => {
  beforeEach(() => {
    (userRepository.updateUser as any).mockResolvedValue({});
  });

  it("Invalid Mime Type", async () => {
    await expect(
      service.uploadAvatar({
        userId: "122443243",
        buffer: Buffer.from("fake"),
        mime: "application/pdf",
        log: mockLog,
      }),
    ).rejects.toThrow("Invalid file type");
  });

  it("uploads avatar successfully for valid mime type", async () => {
    await expect(
      service.uploadAvatar({
        userId: "122443243",
        buffer: Buffer.from("fake"),
        mime: "image/webp",
        log: mockLog,
      }),
    ).resolves.toBeUndefined();

    expect(userRepository.updateUser).toHaveBeenCalledWith("122443243", {
      avatar: "http://avatar.url",
    });
  });
});
