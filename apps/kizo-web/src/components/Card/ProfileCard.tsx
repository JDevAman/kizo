import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../UI/avatar";
import { Button } from "../Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";
import { Input } from "../UI/input";
import { cn } from "../../utils/utils";
import { UpdateProfileInput } from "@kizo/shared";
import { api } from "../../api/api";

export interface ProfileCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  onSave?: (data: UpdateProfileInput) => Promise<void>;
  className?: string;
}

const MAX_AVATAR_SIZE = 100 * 1024; // 100 KB

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName = "",
  lastName = "",
  email = "",
  role = "USER",
  avatarUrl,
  onSave,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localFirst, setLocalFirst] = useState(firstName);
  const [localLast, setLocalLast] = useState(lastName);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | undefined>(
    avatarUrl
  );

  const initials = useMemo(
    () => getInitials(localFirst, localLast),
    [localFirst, localLast]
  );

  // cleanup blob URLs
  useEffect(() => {
    return () => {
      if (localAvatarUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(localAvatarUrl);
      }
    };
  }, [localAvatarUrl]);

  const handlePickAvatar = () => {
    if (!editMode || uploading) return;
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatar must be under 100KB");
      return;
    }

    setUploading(true);
    setError(null);

    const preview = URL.createObjectURL(file);
    setLocalAvatarUrl(preview);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    } catch {
      URL.revokeObjectURL(preview);
      setLocalAvatarUrl(avatarUrl);
      setError("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!localFirst.trim() || !localLast.trim()) {
      setError("First and last name are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: UpdateProfileInput = {
        firstName: localFirst.trim(),
        lastName: localLast.trim(),
      };

      if (onSave) await onSave(payload);
      setEditMode(false);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalFirst(firstName);
    setLocalLast(lastName);
    setLocalAvatarUrl(avatarUrl);
    setError(null);
    setEditMode(false);
  };

  return (
    <Card
      className={cn(
        "max-w-2xl w-full bg-slate-900/60 border-slate-800",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-white">Profile</CardTitle>
        <CardDescription className="text-slate-400">
          Manage your personal information and avatar
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-1 ring-slate-700">
            {localAvatarUrl ? (
              <AvatarImage src={localAvatarUrl} />
            ) : (
              <AvatarFallback>{initials}</AvatarFallback>
            )}
          </Avatar>

          <div>
            <Button
              size="sm"
              variant="glow"
              onClick={handlePickAvatar}
              disabled={!editMode || uploading}
            >
              {uploading ? "Uploading..." : "Change picture"}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={localFirst}
            onChange={(e) => setLocalFirst(e.target.value)}
            disabled={!editMode}
            placeholder="First name"
          />
          <Input
            value={localLast}
            onChange={(e) => setLocalLast(e.target.value)}
            disabled={!editMode}
            placeholder="Last name"
          />
        </div>

        <Input value={email} disabled />
        <Input value={role} disabled />

        {error && <p className="text-sm text-red-400">{error}</p>}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {!editMode ? (
          <Button variant="glow" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
