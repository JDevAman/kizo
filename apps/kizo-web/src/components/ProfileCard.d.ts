import React from "react";
import { UpdateProfileInput } from "@kizo/shared";
export interface ProfileCardProps {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
    onSave?: (data: UpdateProfileInput) => Promise<void>;
    className?: string;
}
declare const ProfileCard: React.FC<ProfileCardProps>;
export default ProfileCard;
//# sourceMappingURL=ProfileCard.d.ts.map