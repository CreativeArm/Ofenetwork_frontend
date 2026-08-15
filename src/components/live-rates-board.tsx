"use client";

import { useEffect, useState } from "react";
import { RatesBoard } from "./rates-board";
import { fetchRates, mapBackendRatesToBoard } from "../lib/admin-backend";
import { homeRates } from "../lib/mock-data";

interface RateItem {
  id: string;
  name: string;
  deposit: string;
  withdrawal: string;
}

interface LiveRatesBoardProps {
  initialRates: RateItem[];
  marquee?: boolean;
}

export function LiveRatesBoard({ initialRates, marquee = false }: LiveRatesBoardProps) {
  const [rates, setRates] = useState<RateItem[]>(initialRates);

  useEffect(() => {
    fetchRates()
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          setRates(mapBackendRatesToBoard(fetched));
        }
      })
      .catch(() => {
        // keep initial rates if offline
      });
  }, []);

  return <RatesBoard rates={rates} marquee={marquee} />;
}
