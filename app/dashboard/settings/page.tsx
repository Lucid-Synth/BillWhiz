"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { JSX, FormEvent } from "react";
import { authClient } from "@/app/lib/auth-client";
import { redirect } from "next/navigation";

type ToastType = "success" | "error";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

function SectionCard({ title, description, children }: {
    title: string;
    description: string;
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-[#111216] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white/80">{title}</h2>
                <p className="text-xs text-white/30 mt-0.5">{description}</p>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/35 uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
    return (
        <input
            {...props}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white bg-white/4 border border-white/8 hover:border-white/[0.14] focus:border-amber-400/50 focus:bg-white/6 focus:shadow-[0_0_0_3px_rgba(251,191,36,0.07)] outline-none transition-all placeholder:text-white/20"
        />
    );
}

function SaveButton({ loading, label = "Save changes" }: { loading: boolean; label?: string }): JSX.Element {
    return (
        <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-[#0A0B0F] text-sm font-bold hover:bg-amber-300 active:scale-[0.98] disabled:opacity-60 transition-all flex items-center gap-2"
        >
            {loading && <span className="w-3.5 h-3.5 border-2 border-[#0A0B0F]/30 border-t-[#0A0B0F] rounded-full animate-spin" />}
            {label}
        </button>
    );
}

function ToastList({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }): JSX.Element {
    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${t.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}
                    >
                        {t.type === "success" ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        )}
                        {t.message}
                        <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function LogoutDialog({ open, onConfirm, onCancel }: {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}): JSX.Element {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onCancel}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
                    >
                        <div className="mx-4 rounded-2xl border border-white/8 bg-[#111216] shadow-2xl shadow-black/60 p-6">
                            <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-white mb-1">Logout from all devices?</h3>
                            <p className="text-sm text-white/40 mb-6 leading-relaxed">
                                This will sign you out from browser and invalidate all active sessions.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-2.5 rounded-xl border border-white/8 text-sm text-white/50 hover:text-white/80 hover:border-white/[0.14] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function SettingsPage(): JSX.Element {

    const {
        data: session,
        refetch
    } = authClient.useSession();

    if (!session) {
        console.log("unauthorized!!")
    }

    const [toasts, setToasts] = useState<Toast[]>([]);
    const [logoutDialog, setLogoutDialog] = useState<boolean>(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const [nameForm, setNameForm] = useState({
        name: session?.user?.name || "",
    });
    const [loadingName, setLoadingName] = useState(false);
    const toastId = useRef(0);

    function addToast(message: string, type: ToastType): void {
        const id = ++toastId.current;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    }

    function dismissToast(id: number): void {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    async function handleNameSave(e: FormEvent): Promise<void> {
        e.preventDefault();
        try {
            setLoadingName(true);

            await authClient.updateUser({
                name: nameForm.name
            })

            await refetch();

            addToast("Name updated successfully", "success");
        }
        catch (error) {
            addToast("Error in updating name", "error");
        }
        finally {
            setLoadingName(false);
        }
    }


    function handleLogoutConfirm(): void {
        setLogoutDialog(false);
        addToast("Logged out from device", "success");
        authClient.signOut();
        redirect('/');
    }

    return (
        <div className="px-6 py-8 max-w-2xl mx-auto space-y-5">

            <div className="mb-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Account Settings</h1>
                <p className="text-sm text-white/30 mt-0.5">Manage your profile and security preferences</p>
            </div>

            {/* ── Change name ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <SectionCard title="Display Name" description="Update the name shown across your account">
                    <form onSubmit={handleNameSave} className="space-y-4">
                        <Field label="Full name">
                            <Input
                                type="text"
                                value={nameForm.name}
                                onChange={(e) => setNameForm({ name: e.target.value })}
                                placeholder={session?.user.name}
                            />
                        </Field>
                        <div className="flex justify-end">
                            <SaveButton loading={loadingName} />
                        </div>
                    </form>
                </SectionCard>
            </motion.div>

            {/* ── Logout all devices ── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                <div className="rounded-2xl border border-red-500/15 bg-red-500/4 overflow-hidden">
                    <div className="px-6 py-5 border-b border-red-500/10">
                        <h2 className="text-sm font-semibold text-white/80">Logout</h2>
                        <p className="text-xs text-white/30 mt-0.5">Immediately invalidates all active sessions</p>
                    </div>
                    <div className="px-6 py-3 flex items-center justify-between gap-4">
                        <p className="text-xs text-white/35 leading-relaxed max-w-sm">
                            This signs you out of browser. You'll need to log back in.
                        </p>
                        <button
                            onClick={() => setLogoutDialog(true)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 text-sm font-semibold transition-all"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </motion.div>

            <LogoutDialog
                open={logoutDialog}
                onConfirm={handleLogoutConfirm}
                onCancel={() => setLogoutDialog(false)}
            />

            <ToastList toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}