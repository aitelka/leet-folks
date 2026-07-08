"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthLoadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialError = searchParams.get("error") || (!searchParams.get("code") ? "Missing authorization code" : "");
  const [status, setStatus] = useState<"loading" | "error">(initialError ? "error" : "loading");
  const [errorMsg, setErrorMsg] = useState(initialError);
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current || initialError) return;
    exchanged.current = true;

    const code = searchParams.get("code");
    
    fetch("/api/auth/exchange", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        router.replace(data.redirect);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err.message);
      });
  }, [searchParams, router, initialError]);

  return (
    <div className="authLoadingPage">
      <div className="authLoadingBg" />

      {status === "loading" ? (
        <div className="authLoadingCard">
          <div className="authSpinner">
            <div className="authSpinnerRing" />
            <div className="authSpinnerRing authSpinnerRingDelay" />
            <div className="authSpinnerCore">42</div>
          </div>
          <h2 className="authLoadingTitle">Authenticating</h2>
          <p className="authLoadingSubtitle">Connecting to 42 Intra...</p>
          <div className="authLoadingDots">
            <span className="authDot" />
            <span className="authDot" />
            <span className="authDot" />
          </div>
        </div>
      ) : (
        <div className="authLoadingCard authErrorCard">
          <div className="authErrorIcon">✕</div>
          <h2 className="authLoadingTitle">Authentication Failed</h2>
          <p className="authLoadingSubtitle">{errorMsg}</p>
          <a href="/api/auth/login" className="authRetryBtn">
            Try Again
          </a>
        </div>
      )}
    </div>
  );
}

export default function AuthLoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="authLoadingPage">
          <div className="authLoadingBg" />
          <div className="authLoadingCard">
            <div className="authSpinner">
              <div className="authSpinnerRing" />
              <div className="authSpinnerRing authSpinnerRingDelay" />
              <div className="authSpinnerCore">42</div>
            </div>
            <h2 className="authLoadingTitle">Loading</h2>
          </div>
        </div>
      }
    >
      <AuthLoadingContent />
    </Suspense>
  );
}
