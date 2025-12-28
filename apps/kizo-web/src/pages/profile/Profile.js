import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ProfileCard from "../../components/ProfileCard";
import { useSelector } from "react-redux";
export default function ProfilePage() {
    const user = useSelector((state) => state.auth.user);
    if (!user) {
        return (_jsx("main", { className: "min-h-[calc(100dvh-0px)] w-full bg-slate-950 text-slate-100 flex items-center justify-center", children: _jsx("p", { className: "text-slate-400", children: "No user logged in." }) }));
    }
    return (_jsx("main", { className: "min-h-[calc(100dvh-0px)] w-full bg-slate-950 text-slate-100", children: _jsxs("section", { className: "mx-auto max-w-5xl px-4 py-8 md:py-12", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl md:text-3xl font-semibold", children: "Your Profile" }), _jsx("p", { className: "mt-1 text-slate-400", children: "View and edit your personal information." })] }), _jsx(ProfileCard, { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatarUrl: user.avatar ?? undefined, onSave: async (data) => {
                        console.log("Saved profile:", data);
                        // dispatch(setUser({ id: user.id, name: `${data.firstName} ${data.lastName}`, email: data.email }))
                    } })] }) }));
}
