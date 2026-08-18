"use client";

import { useEffect, useState } from "react";
import { fetchRates, mapBackendRatesToBoard } from "../lib/admin-backend";
import { RatesBoard } from "./rates-board";

type RateItem = {
  id: string;
  name: string;
  deposit: string;
  withdrawal: string;
};

export function AdminLiveRatesBoard() {
  const [rates, setRates] = useState<RateItem[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    fetchRates()
      .then((items) => setRates(mapBackendRatesToBoard(items)))
      .catch(() => {
        setLoadFailed(true);
        setRates([]);
      });
  }, []);

  if (rates === null) {
    return <p className="py-6 text-sm text-slate-500">Loading live rates…</p>;
  }

  if (loadFailed || rates.length === 0) {
    return <p className="py-6 text-sm text-slate-500">Live rates are temporarily unavailable.</p>;
  }

  return <RatesBoard rates={rates} admin actionHref="/admin/rates" />;
}
