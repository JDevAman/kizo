import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "../../src/services/user.service";
import { userRepository } from "../../src/repositories/user.repository";
import * as tokenUtils from "../../src/utils/tokens";

// mocks
vi.mock("../../src/repositories/user.repository");
vi.mock("../../src/utils/tokens");
vi.mock("sharp", () => ({
  default: vi.fn(() => sharpMock),
}));
vi.mock("../../src/lib/storage", () => ({
  getSupabase: () => ({
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: "https://cdn.test/avatar.webp" },
        }),
      })),
    },
  }),
}));

const service = new UserService();
const sharpMock = {
  resize: vi.fn().mockReturnThis(),
  webp: vi.fn().mockReturnThis(),
  toBuffer: vi.fn().mockResolvedValue(Buffer.from("optimized")),
};

describe("UserService.updateProfile", () => {
  beforeEach(() => {
    (userRepository.updateUser as any).mockResolvedValue({ id: "user-id" });
    (tokenUtils.signAccessToken as any).mockReturnValue("new-token");
  });

  it("updates user and returns new token", async () => {
    const result = await service.updateProfile("user-id", {
      firstName: "Aman",
      lastName: "Singh",
    });

    expect(userRepository.updateUser).toHaveBeenCalledWith("user-id", {
      firstName: "Aman",
      lastName: "Singh",
    });

    expect(tokenUtils.signAccessToken).toHaveBeenCalledWith({
      id: "user-id",
    });

    expect(result).toEqual({ token: "new-token" });
  });

  it("updates only provided fields", async () => {
    await service.updateProfile("user-id", {
      firstName: "Aman",
    });

    expect(userRepository.updateUser).toHaveBeenCalledWith("user-id", {
      firstName: "Aman",
    });

    expect(tokenUtils.signAccessToken).toHaveBeenCalledOnce();
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
      }),
    ).rejects.toThrow("Invalid file type");
  });

  it("uploads avatar successfully for valid mime type", async () => {
    await expect(
      service.uploadAvatar({
        userId: "122443243",
        buffer: Buffer.from("fake"),
        mime: "image/webp",
      }),
    ).resolves.toBeUndefined();

    expect(userRepository.updateUser).toHaveBeenCalledWith("122443243", {
      avatar: "https://cdn.test/avatar.webp",
    });
  });
});
