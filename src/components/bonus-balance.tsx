"use client";

import { useEffect, useState } from "react";
import {
  calculateBonusBalance,
  fetchUserWallet,
  formatCurrency,
} from "../lib/admin-backend";

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
    try {
      const rawUser = window.localStorage.getItem("ofe_user");
      const parsed = rawUser ? (JSON.parse(rawUser) as StoredUser) : null;
      if (!parsed?.id) {
        setBalance(fallback);
        return;
      }

      fetchUserWallet(parsed.id)
        .then((wallet) => {
          setBalance(formatCurrency(calculateBonusBalance(wallet), "NGN"));
        })
        .catch(() => setBalance(fallback));
    } catch {
      setBalance(fallback);
    }
  }, [fallback]);

  return <>{balance}</>;
}
