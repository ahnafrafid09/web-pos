"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Store } from "lucide-react";

import { useAuth } from "@/features/auth/provider/auth-provider";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          {/* SPINNER */}
          <motion.div
            className="h-10 w-10 rounded-full border-2 border-muted border-t-[#4A5D23]"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* TEXT */}
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Memeriksa sesi</span>

            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
              }}
            >
              .
            </motion.span>

            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.2,
              }}
            >
              .
            </motion.span>

            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.4,
              }}
            >
              .
            </motion.span>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return null;
  }

  return <LoginForm />;
}
