import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMe } from "../../src/controllers/user.controller";
import { userRepository } from "../../src/repositories/user.repository";

// mock repository
vi.mock("../../src/repositories/user.repository");

describe("UserController.getMe (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const user = {
    id: "user-id",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    role: "USER",
    avatar: null,
  };

  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  it("returns user profile when authenticated", async () => {
    const req: any = {
      user: { id: "user-id" },
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(user as any);

    await getMe(req, res);

    expect(userRepository.findById).toHaveBeenCalledWith("user-id");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User Profile Fetched",
      user,
    });
  });

  it("returns 401 when user not authenticated", async () => {
    const req: any = {}; // no req.user

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not logged in" });
  });

  it("returns 404 when user no longer exists", async () => {
    const req: any = {
      user: { id: "user-id" },
    };

    vi.spyOn(userRepository, "findById").mockResolvedValue(null);

    await getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User no longer exists",
    });
  });
});
