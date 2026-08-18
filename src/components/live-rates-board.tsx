"use client";

import { useEffect, useState } from "react";
import { RatesBoard } from "./rates-board";
import { fetchRates, mapBackendRatesToBoard } from "../lib/admin-backend";

interface RateItem {
  id: string;
  name: string;
  deposit: string;
  withdrawal: string;
}

interface LiveRatesBoardProps {
  marquee?: boolean;
}

export function LiveRatesBoard({ marquee = false }: LiveRatesBoardProps) {
  const [rates, setRates] = useState<RateItem[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    fetchRates()
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          setRates(mapBackendRatesToBoard(fetched));
        } else {
          setRates([]);
        }
      })
      .catch(() => {
        setLoadFailed(true);
        setRates([]);
      });
  }, []);

  if (rates === null) {
    return <p className="py-4 text-center text-sm text-slate-500">Loading live rates…</p>;
  }

  if (loadFailed || rates.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500">Live rates are temporarily unavailable.</p>;
  }

  return <RatesBoard rates={rates} marquee={marquee} />;
}
