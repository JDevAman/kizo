import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMe,
  updateProfile,
  uploadAvatar,
} from "../../src/controllers/user.controller";
import { userRepository } from "../../src/repositories/user.repository";
import { userService } from "../../src/services/user.service";

// mocks
vi.mock("../../src/repositories/user.repository");
vi.mock("../../src/services/user.service");

describe("UserController.getMe (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user profile when authenticated", async () => {
    const req: any = { user: { id: "user-id" } };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const user = {
      id: "user-id",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      role: "USER",
      avatar: null,
    };

    (userRepository.findById as any).mockResolvedValue(user);

    await getMe(req, res);

    expect(userRepository.findById).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User Profile Fetched",
      user,
    });
  });

  it("returns 401 when user not authenticated", async () => {
    const req: any = {};

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not logged in" });
  });
});

describe("userController.updateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates profile and sets new access token", async () => {
    const req: any = {
      user: { id: "user-id" },
      body: {
        firstName: "Aman",
        lastName: "Singh",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      cookie: vi.fn(),
    };

    // ✅ MOCK FIRST (correct shape)
    (userService.updateProfile as any).mockResolvedValue({
      user: { id: "user-id" },
      accessToken: "new-access-token",
    });

    await updateProfile(req, res);

    expect(userService.updateProfile).toHaveBeenCalledWith("user-id", {
      firstName: "Aman",
      lastName: "Singh",
    });

    expect(res.cookie).toHaveBeenCalled(); // ✅ now passes
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User profile updated",
    });
  });
});

describe("userController.uploadAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uploads avatar for authenticated user", async () => {
    const req: any = {
      user: { id: "user-id" },
      file: {
        buffer: Buffer.from("fake"),
        mimetype: "image/webp",
      },
    };

    const res: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    (userService.uploadAvatar as any).mockResolvedValue(undefined);

    await uploadAvatar(req, res);

    expect(userService.uploadAvatar).toHaveBeenCalledWith({
      userId: "user-id",
      buffer: req.file.buffer,
      mime: req.file.mimetype,
    });

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});
