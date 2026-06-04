"use client";

import { useMemo, useState } from "react";
import { AdminStatusBadge } from "./admin-ui";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:4000/api";

export type TransactionStatus = "Pending" | "Confirmed" | "Rejected";

export interface AdminTransactionRecord {
  id: string;
  user: string;
  service: string;
  type: string;
  amount: string;
  status: TransactionStatus;
  time: string;
  paymentReference: string;
  paymentReferenceLabel?: string;
  proofName: string;
  proofHref: string;
  bonusWithdrawalRequested?: boolean;
  destinationDetails?: Record<string, string>;
  adminActionHistory?: Array<{
    action: string;
    actorId: string;
    note?: string;
    at: string;
  }>;
}

interface AdminTransactionsQueueProps {
  items: readonly AdminTransactionRecord[];
}

function toneForStatus(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("confirm")) {
    return "success" as const;
  }
  if (lower.includes("pending")) {
    return "warning" as const;
  }
  if (lower.includes("reject")) {
    return "danger" as const;
  }
  return "neutral" as const;
}

const filters = ["All", "Pending", "Confirmed", "Rejected"] as const;
const hiddenDetailKeys = new Set(["bonusCreditBreakdown"]);

function formatDetailLabel(label: string) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSubmittedDetails(transaction: AdminTransactionRecord) {
  const details =
    transaction.destinationDetails &&
    Object.entries(transaction.destinationDetails)
      .filter(([key, value]) => value && !hiddenDetailKeys.has(key))
      .map(([key, value]) => ({
        label: formatDetailLabel(key),
        value,
      }));

  if (details && details.length > 0) {
    return details;
  }

  return [
    {
      label: transaction.paymentReferenceLabel ?? "Submitted Detail",
      value: transaction.paymentReference,
    },
  ];
}

export function AdminTransactionsQueue({ items }: AdminTransactionsQueueProps) {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>("Pending");
  const [transactions, setTransactions] = useState(items);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const activeTransaction =
    transactions.find((item) => item.id === activeTransactionId) ?? null;
  const activeSubmittedDetails = activeTransaction
    ? getSubmittedDetails(activeTransaction)
    : [];

  const filteredTransactions = useMemo(() => {
    if (selectedFilter === "All") {
      return transactions;
    }

    return transactions.filter((item) => item.status === selectedFilter);
  }, [selectedFilter, transactions]);

  const updateStatus = async (id: string, status: TransactionStatus) => {
    const previousStatus =
      transactions.find((item) => item.id === id)?.status ?? "Pending";

    setTransactions((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    if (status === "Pending") {
      return;
    }

    setIsUpdating(true);

    try {
      const storedUser = window.localStorage.getItem("ofe_user");
      const actorId = storedUser ? (JSON.parse(storedUser) as { id?: string }).id : undefined;

      const response = await fetch(`${API_BASE_URL}/transactions/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status === "Confirmed" ? "CONFIRMED" : "REJECTED",
          actorId: actorId ?? "admin-local",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }
    } catch {
      setTransactions((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status: previousStatus } : item,
        ),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Manual Review Queue</h3>
          <p className="text-sm text-slate-500">
            Approve, reject, and track every financial movement.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSelectedFilter(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedFilter === item
                  ? "bg-[#0f7b36] text-white"
                  : "bg-[#f4f7f5] text-slate-600 hover:bg-[#eaf4ed]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 rounded-[22px] border border-[#edf1ee] p-4 md:grid-cols-[1fr_0.85fr_0.6fr_0.55fr] md:items-center"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.user}</p>
              <p className="text-sm text-slate-500">{item.service}</p>
              <p className="mt-1 text-xs text-slate-400">{item.id}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.type}</p>
              <p className="text-sm text-slate-500">{item.amount}</p>
            </div>
            <div>
              <AdminStatusBadge label={item.status} tone={toneForStatus(item.status)} />
              <p className="mt-2 text-xs text-slate-400">{item.time}</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTransactionId(item.id)}
              className="rounded-xl border border-[#dbe5df] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f8fbf8]"
            >
              Open
            </button>
          </div>
        ))}
      </div>

      {activeTransaction ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/18 px-4 backdrop-blur-[2px]"
          onClick={() => setActiveTransactionId(null)}
        >
          <div
            className="w-full max-w-[460px] rounded-[28px] border border-[#e5ebe7] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,32,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Transaction Review
                </p>
                <h4 className="mt-2 text-xl font-semibold text-slate-900">
                  {activeTransaction.user}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {activeTransaction.service} {"|"} {activeTransaction.amount}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTransactionId(null)}
                className="rounded-full border border-[#dbe5df] px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-[#f8fbf8]"
              >
                Close
              </button>
            </div>

            <div className="mt-5">
              <div className="rounded-[18px] bg-[#f8fbf8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>
                <div className="mt-2">
                  <AdminStatusBadge
                    label={activeTransaction.status}
                    tone={toneForStatus(activeTransaction.status)}
                  />
                </div>
              </div>
            </div>

            {activeTransaction.bonusWithdrawalRequested ? (
              <div className="mt-4 rounded-[18px] border border-emerald-100 bg-emerald-50 px-4 py-3">
                <p className="text-sm font-semibold text-emerald-800">
                  Bonus withdrawal requested
                </p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Review this user&apos;s available referral or threshold bonus before confirming the withdrawal.
                </p>
              </div>
            ) : null}

            <div className="mt-4 rounded-[18px] bg-[#f8fbf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Submitted Information
              </p>
              <div className="mt-3 overflow-hidden rounded-[16px] border border-[#e5ebe7] bg-white">
                {activeSubmittedDetails.map((detail) => (
                  <div
                    key={`${detail.label}-${detail.value}`}
                    className="grid gap-1 border-b border-[#edf1ee] px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[0.65fr_1fr] sm:gap-4"
                  >
                    <span className="font-medium text-slate-500">{detail.label}</span>
                    <span className="break-all font-semibold text-slate-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-[#e5ebe7] bg-[#fbfdfb] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Attached receipt / proof
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Download the uploaded file to inspect the screenshot in full.
                  </p>
                </div>
                <a
                  href={activeTransaction.proofHref}
                  download={activeTransaction.proofName}
                  className="rounded-xl border border-[#cfe2d5] px-3 py-2 text-xs font-semibold text-[#0f7b36] transition hover:bg-[#eef8f1]"
                >
                  Download
                </a>
              </div>

              <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e5ebe7] bg-white">
                <img
                  src={activeTransaction.proofHref}
                  alt={`${activeTransaction.id} uploaded proof`}
                  className="h-40 w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Quick Action
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["Pending", "Confirmed", "Rejected"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => void updateStatus(activeTransaction.id, status)}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      activeTransaction.status === status
                        ? status === "Confirmed"
                          ? "bg-emerald-600 text-white"
                          : status === "Rejected"
                            ? "bg-rose-600 text-white"
                            : "bg-amber-500 text-white"
                        : "border border-[#dbe5df] bg-white text-slate-700 hover:bg-[#f8fbf8]"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {activeTransaction.adminActionHistory &&
            activeTransaction.adminActionHistory.length > 0 ? (
              <div className="mt-5 rounded-[18px] border border-[#edf1ee] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Review History
                </p>
                <div className="mt-3 space-y-3">
                  {activeTransaction.adminActionHistory.map((entry, index) => (
                    <div key={`${entry.at}-${index}`} className="text-sm">
                      <p className="font-semibold text-slate-900">{entry.action}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {entry.at ? new Date(entry.at).toLocaleString("en-NG") : "Unknown time"}
                      </p>
                      {entry.note ? (
                        <p className="mt-1 text-xs text-slate-500">{entry.note}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
