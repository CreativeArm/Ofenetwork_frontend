"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Reveal } from "./homepage-motion";

interface OAuthUser {
  role?: string;
  fullName?: string;
  email?: string;
}

function isSafeNextPath(value: string | null) {
  return Boolean(value && value.startsWith("/") && !value.startsWith("//"));
}

export function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken") ?? searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const userPayload = searchParams.get("user");
    const oauthError = searchParams.get("oauthError") ?? searchParams.get("error");

    if (oauthError) {
      setErrorMessage(oauthError);
      return;
    }

    if (!accessToken || !refreshToken || !userPayload) {
      setErrorMessage("Social login could not complete. Please try again.");
      return;
    }

    try {
      const user = JSON.parse(userPayload) as OAuthUser;

      window.localStorage.setItem("ofe_access_token", accessToken);
      window.localStorage.setItem("ofe_refresh_token", refreshToken);
      window.localStorage.setItem("ofe_user", JSON.stringify(user));

      const nextPath = searchParams.get("next");
      const destination = isSafeNextPath(nextPath)
        ? nextPath
        : user.role === "ADMIN"
          ? "/admin"
          : "/dashboard";

      window.setTimeout(() => {
        router.replace(destination ?? "/dashboard");
      }, 350);
    } catch {
      setErrorMessage("Social login returned invalid session details.");
    }
  }, [router, searchParams]);

  return (
    <Reveal mode="load" delay={0.08}>
      <div className="mx-auto max-w-lg rounded-[32px] border border-[#e7eee9] bg-white p-8 text-center shadow-[0_18px_45px_rgba(15,23,32,0.08)]">
        {errorMessage ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl font-bold text-rose-600">
              !
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Social login failed
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{errorMessage}</p>
            <Link
              href={`/login?oauthError=${encodeURIComponent(errorMessage)}`}
              className="mt-6 inline-flex rounded-2xl bg-[#0f7b36] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0d6b2f]"
            >
              Back to login
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-emerald-50 ring-8 ring-emerald-50/60">
              <div className="h-full w-full rounded-2xl bg-emerald-600" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-950">
              Signing you in
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We are confirming your social account and opening your dashboard.
            </p>
          </>
        )}
      </div>
    </Reveal>
  );
}
