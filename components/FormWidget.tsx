"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrbitButton } from "./OrbitComponents/OrbitButton";
import { OrbitInput } from "./OrbitComponents/OrbitInput";
import { OrbitLoader } from "./OrbitComponents/OrbitLoader";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormStatus = "idle" | "submitting" | "success" | "failed";

export default function FormWidget() {
  const [isDown, setIsDown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      const [result] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`, {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "" },
        }).then((r) => r.json()),
        new Promise((res) => setTimeout(res, 800)),
      ]);

      if (result.status === "fulfilled") {
        setIsDown(!result.value.online);
      } else {
        setIsDown(true);
      }
      setIsLoading(false);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  // ── Replace this body with your real API call ──────────────────────────────
  const handleSubmit = async () => {
    if (!email) return;
    setStatus("submitting");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
        body: JSON.stringify({ name: name || undefined, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Server error (${res.status})`);
      }

      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("failed");
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const resetForm = () => {
    setStatus("idle");
    setName("");
    setEmail("");
    setErrorMessage("");
  };

  return (
    <div className="relative z-50 text-slate-900 flex flex-col items-center w-full px-4 md:px-0">
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "w-full max-w-md overflow-hidden rounded-3xl backdrop-blur-xl border",
          isLoading
            ? "bg-slate-100"
            : isDown
              ? "bg-blush-background"
              : "bg-daylight-primary",
        )}
      >
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 bento-texture mix-blend-multiply opacity-40" />

        {/* Content */}
        <div className="relative p-6 md:p-8">
          <AnimatePresence mode="wait">
            {/* ── Checking server status ── */}
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex flex-col items-center justify-center gap-4 py-16"
              >
                <OrbitLoader variant="spinner" size="lg" />
                <p className="text-sm font-medium text-slate-400 tracking-wide">
                  Checking server status…
                </p>
              </motion.div>
            ) : status === "submitting" ? (
              /* ── Submitting ── */
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center gap-4 py-16"
              >
                <OrbitLoader variant="spinner" size="lg" />
                <p className="text-sm font-medium text-slate-400 tracking-wide">
                  Registering your email…
                </p>
              </motion.div>
            ) : status === "success" ? (
              /* ── Success ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center text-center gap-6 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-2"
                >
                  <span className="text-3xl">✓</span>
                </motion.div>

                <div className="space-y-2">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold text-slate-900"
                  >
                    You&apos;re Protected
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-500 max-w-xs mx-auto"
                  >
                    We&apos;ve added you to the notification list. You&apos;ll
                    be the first to know if anything changes.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4"
                >
                  <OrbitButton
                    haptic="success"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Done
                  </OrbitButton>
                </motion.div>
              </motion.div>
            ) : status === "failed" ? (
              /* ── Failed ── */
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <div className="space-y-2">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl text-danger font-bold mb-2 font-serif-orbit"
                  >
                    Registration Failed
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className=" max-w-xs mx-auto font-mono-orbit"
                  >
                    {errorMessage || "Something went wrong. Please try again."}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3 mt-4"
                >
                  <OrbitButton
                    haptic="success"
                    variant="solid"
                    onClick={handleSubmit}
                  >
                    Try Again
                  </OrbitButton>
                  <OrbitButton
                    haptic="success"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Go Back
                  </OrbitButton>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="self-stretch">
                    <AnimatePresence mode="wait">
                      {isDown ? (
                        <motion.div
                          key="down"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="flex items-center gap-2.5 w-full"
                        >
                          <span className="relative flex h-3 w-3 shrink-0">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-dangeropacity-75 animate-ping" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-danger" />
                          </span>
                          <span className="text-sm font-bold font-mono-orbit text-danger">
                            Server Offline
                          </span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="up"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="flex items-center gap-2.5 w-full"
                        >
                          <span className="relative flex h-3 w-3 shrink-0">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                          </span>
                          <span className="text-sm font-bold font-mono-orbit text-success">
                            Server Active
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <h1 className="text-4xl font-serif-orbit font-bold mb-4">
                      Stay Informed, Always.
                    </h1>
                    <p className="text-sm text-silent font-sans-orbit mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                      {isDown
                        ? "Our server is currently unavailable. Leave your email and we'll notify you the moment it's back online — no action needed on your end."
                        : "Register your email to receive alerts if our server experiences any downtime. You'll be notified right away so you're never left in the dark."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  {!isDown && (
                    <OrbitInput
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  )}

                  <OrbitInput
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <OrbitButton
                    onClick={handleSubmit}
                    disabled={!email}
                    loading={status === ("submitting" as FormStatus)}
                  >
                    {isDown ? "Notify Me" : "Register"}
                  </OrbitButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
