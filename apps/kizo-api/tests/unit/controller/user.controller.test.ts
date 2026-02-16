import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMe,
  updateProfile,
  uploadAvatar,
} from "../../../src/controllers/user.controller";
import { userRepository } from "@kizo/db";
import { userService } from "../../../src/services/user.service";
import * as cacheHelper from "../../../src/utils/cacheHelper";

// mocks
vi.mock("../../../src/services/user.service", () => ({
  userService: {
    updateProfile: vi.fn(),
    uploadAvatar: vi.fn(),
    bulkSearch: vi.fn(),
  },
}));
vi.mock("../../../src/utils/cacheHelper", () => ({
  invalidateProfileCache: vi.fn(), // 💡 Ensure this is a spy
}));

describe("UserController Unit Tests", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    vi.clearAllMocks();

    req = {
      user: { id: "user-123" },
      body: {},
      log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() }, // Needed for req.log.info
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe("getMe", () => {
    it("✅ SUCCESS: returns mapped user profile", async () => {
      const mockUser = {
        id: "user-123",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        role: "USER",
        avatar: null,
      };

      vi.mocked(userRepository.findById).mockResolvedValue(mockUser as any);

      await getMe(req, res, next);

      expect(userRepository.findById).toHaveBeenCalledWith("user-123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User Profile Fetched",
        user: mockUser,
      } as any);
    });

    it("❌ FAILURE: calls next with 401 if req.user is missing", async () => {
      req.user = undefined;

      await getMe(req, res, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 401 }),
      );
    });
  });

  describe("Update Profile", () => {
    it("✅ SUCCESS: updates profile and invalidates cache", async () => {
      req.body = { firstName: "Aman" };

      vi.mocked(userService.updateProfile).mockResolvedValue({
        user: { id: "user-123" },
        accessToken: "new-access-token",
      } as any);

      await updateProfile(req, res, next);

      expect(userService.updateProfile).toHaveBeenCalledWith(
        "user-123",
        req.body,
      );

      expect(cacheHelper.invalidateProfileCache).toHaveBeenCalledWith(
        "user-123",
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("uploadAvatar", () => {
    it("✅ SUCCESS: processes file buffer and logs activity", async () => {
      req.file = { buffer: Buffer.from("fake-img"), mimetype: "image/png" };
      vi.mocked(userService.uploadAvatar).mockResolvedValue(undefined);

      await uploadAvatar(req, res, next);

      expect(userService.uploadAvatar).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-123",
          mime: req.file.mimetype,
        }),
      );

      expect(req.log.info).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("❌ FAILURE: throws 400 if no file is provided", async () => {
      req.file = undefined;

      await uploadAvatar(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ status: 400 }),
      );
    });
  });
});
