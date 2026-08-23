"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authStorage } from "@/features/auth/lib/auth-storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = authStorage.getAccessToken();

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
