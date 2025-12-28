import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cn, Input, } from "@kizo/ui";
import { api } from "../../../../apps/kizo-web/src/api/api.js";
const MAX_AVATAR_SIZE = 100 * 1024; // 100 KB
function getInitials(firstName, lastName) {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "U";
}
const ProfileCard = ({ firstName = "", lastName = "", email = "", role = "USER", avatarUrl, onSave, className, }) => {
    const fileInputRef = useRef(null);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [localFirst, setLocalFirst] = useState(firstName);
    const [localLast, setLocalLast] = useState(lastName);
    const [localAvatarUrl, setLocalAvatarUrl] = useState(avatarUrl);
    const initials = useMemo(() => getInitials(localFirst, localLast), [localFirst, localLast]);
    // cleanup blob URLs
    useEffect(() => {
        return () => {
            if (localAvatarUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(localAvatarUrl);
            }
        };
    }, [localAvatarUrl]);
    const handlePickAvatar = () => {
        if (!editMode || uploading)
            return;
        fileInputRef.current?.click();
    };
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
        }
        catch {
            URL.revokeObjectURL(preview);
            setLocalAvatarUrl(avatarUrl);
            setError("Failed to upload avatar");
        }
        finally {
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
            const payload = {
                firstName: localFirst.trim(),
                lastName: localLast.trim(),
            };
            if (onSave)
                await onSave(payload);
            setEditMode(false);
        }
        catch {
            setError("Failed to save changes");
        }
        finally {
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
    return (_jsxs(Card, { className: cn("max-w-2xl w-full bg-slate-900/60 border-slate-800", className), children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-white", children: "Profile" }), _jsx(CardDescription, { className: "text-slate-400", children: "Manage your personal information and avatar" })] }), _jsxs(CardContent, { className: "grid gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Avatar, { className: "h-16 w-16 ring-1 ring-slate-700", children: localAvatarUrl ? (_jsx(AvatarImage, { src: localAvatarUrl })) : (_jsx(AvatarFallback, { children: initials })) }), _jsx("div", { children: _jsx(Button, { size: "sm", variant: "glow", onClick: handlePickAvatar, disabled: !editMode || uploading, children: uploading ? "Uploading..." : "Change picture" }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarChange })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { value: localFirst, onChange: (e) => setLocalFirst(e.target.value), disabled: !editMode, placeholder: "First name" }), _jsx(Input, { value: localLast, onChange: (e) => setLocalLast(e.target.value), disabled: !editMode, placeholder: "Last name" })] }), _jsx(Input, { value: email, disabled: true }), _jsx(Input, { value: role, disabled: true }), error && _jsx("p", { className: "text-sm text-red-400", children: error })] }), _jsx(CardFooter, { className: "flex justify-end gap-2", children: !editMode ? (_jsx(Button, { variant: "glow", onClick: () => setEditMode(true), children: "Edit Profile" })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "ghost", onClick: handleCancel, children: "Cancel" }), _jsx(Button, { onClick: handleSave, disabled: saving || uploading, className: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30", children: saving ? "Saving..." : "Save" })] })) })] }));
};
export default ProfileCard;
