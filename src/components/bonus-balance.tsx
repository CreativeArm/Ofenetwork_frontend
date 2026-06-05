"use client";

import { useEffect, useState } from "react";
import {
  calculateBonusBalance,
  fetchUserWallet,
  formatCurrency,
} from "../lib/admin-backend";
import { BONUS_BALANCE_UPDATED_EVENT } from "../lib/bonus-events";

type StoredUser = {
  id?: string;
};

export function BonusBalanceAmount({
  fallback = "N0.00",
}: {
  fallback?: string;
}) {
  const [balance, setBalance] = useState(fallback);

  useEffect(() => {
    let isMounted = true;

    const loadBalance = async () => {
      try {
        const rawUser = window.localStorage.getItem("ofe_user");
        const parsed = rawUser ? (JSON.parse(rawUser) as StoredUser) : null;

        if (!parsed?.id) {
          if (isMounted) {
            setBalance(fallback);
          }
          return;
        }

        const wallet = await fetchUserWallet(parsed.id);
        if (isMounted) {
          setBalance(formatCurrency(calculateBonusBalance(wallet), "NGN"));
        }
      } catch {
        if (isMounted) {
          setBalance(fallback);
        }
      }
    };

    const handleBonusUpdate = (event: Event) => {
      try {
        const rawUser = window.localStorage.getItem("ofe_user");
        const parsed = rawUser ? (JSON.parse(rawUser) as StoredUser) : null;
        const updatedUserId = (event as CustomEvent<{ userId?: string }>).detail
          ?.userId;

        if (!updatedUserId || updatedUserId === parsed?.id) {
          loadBalance();
        }
      } catch {
        loadBalance();
      }
    };

    loadBalance();
    const interval = window.setInterval(loadBalance, 10000);
    window.addEventListener("focus", loadBalance);
    window.addEventListener(BONUS_BALANCE_UPDATED_EVENT, handleBonusUpdate);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", loadBalance);
      window.removeEventListener(BONUS_BALANCE_UPDATED_EVENT, handleBonusUpdate);
    };
  }, [fallback]);

  return <>{balance}</>;
}
