"use client";

import { useMemo, useState } from "react";
import { updateKycStatus, type BackendKycStatus } from "../lib/admin-backend";
import { useBodyScrollLock } from "../lib/use-body-scroll-lock";
import { AdminStatusBadge } from "./admin-ui";

type KycStatus = "Pending" | "Flagged" | "Approved";

export interface KycRecord {
  id: string;
  userId?: string;
  user: string;
  document: string;
  risk: string;
  status: KycStatus;
  submittedAt: string;
  proofName: string;
  proofHref: string;
  notes: string;
}

interface AdminKycQueueProps {
  items: readonly KycRecord[];
}

function toneForStatus(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("approved")) {
    return "success" as const;
  }
  if (lower.includes("pending")) {
    return "warning" as const;
  }
  if (lower.includes("flagged")) {
    return "danger" as const;
  }
  return "neutral" as const;
}

const filters = ["All", "Pending", "Flagged", "Approved"] as const;

export function AdminKycQueue({ items }: AdminKycQueueProps) {
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>("Pending");
  const [records, setRecords] = useState(items);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const activeRecord = records.find((item) => item.id === activeRecordId) ?? null;
  const activeProofIsImage =
    activeRecord?.proofHref.startsWith("data:image/") ||
    /\.(png|jpe?g|webp|gif|svg)(?:$|\?)/i.test(activeRecord?.proofHref ?? "");

  useBodyScrollLock(Boolean(activeRecord));

  const filteredRecords = useMemo(() => {
    if (selectedFilter === "All") {
      return records;
    }

    return records.filter((item) => item.status === selectedFilter);
  }, [records, selectedFilter]);

  const statusToBackend = (status: KycStatus): BackendKycStatus =>
    status === "Approved" ? "APPROVED" : status === "Flagged" ? "REJECTED" : "PENDING";

  const updateStatus = async (id: string, status: KycStatus) => {
    const record = records.find((item) => item.id === id);
    const previousStatus = record?.status ?? "Pending";

    setRecords((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    if (!record?.userId) {
      return;
    }

    setIsUpdating(true);

    try {
      const storedUser = window.localStorage.getItem("ofe_user");
      const actorId = storedUser ? (JSON.parse(storedUser) as { id?: string }).id : undefined;
      await updateKycStatus({
        userId: record.userId,
        status: statusToBackend(status),
        actorId: actorId ?? "admin-local",
        note:
          status === "Approved"
            ? "KYC approved. Transactions are now available."
            : status === "Flagged"
              ? "KYC rejected. Please submit a clearer or valid document."
              : "KYC returned to pending review.",
      });
    } catch {
      setRecords((current) =>
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
          <h3 className="text-xl font-semibold">Verification Queue</h3>
          <p className="text-sm text-slate-500">
            Review identity documents and resolve risky submissions quickly.
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
        {filteredRecords.map((item) => (
          <div
            key={item.id}
            className="grid gap-4 rounded-[22px] border border-[#edf1ee] p-4 md:grid-cols-[1fr_0.8fr_0.55fr_0.55fr_0.45fr] md:items-center"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.user}</p>
              <p className="text-sm text-slate-500">{item.document}</p>
              <p className="mt-1 text-xs text-slate-400">{item.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Submitted
              </p>
              <p className="mt-1 text-sm text-slate-700">{item.submittedAt}</p>
            </div>
            <div>
              <AdminStatusBadge label={`${item.risk} Risk`} tone={toneForStatus(item.risk)} />
            </div>
            <div>
              <AdminStatusBadge label={item.status} tone={toneForStatus(item.status)} />
            </div>
            <button
              type="button"
              onClick={() => setActiveRecordId(item.id)}
              className="rounded-xl border border-[#dbe5df] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f8fbf8]"
            >
              Review
            </button>
          </div>
        ))}
      </div>

      {activeRecord ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/18 px-4 backdrop-blur-[2px]"
          onClick={() => setActiveRecordId(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-[28px] border border-[#e5ebe7] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,32,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  KYC Review
                </p>
                <h4 className="mt-2 text-xl font-semibold text-slate-900">
                  {activeRecord.user}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {activeRecord.document} {"|"} {activeRecord.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRecordId(null)}
                className="rounded-full border border-[#dbe5df] px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-[#f8fbf8]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] bg-[#f8fbf8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Risk
                </p>
                <div className="mt-2">
                  <AdminStatusBadge
                    label={`${activeRecord.risk} Risk`}
                    tone={toneForStatus(activeRecord.risk)}
                  />
                </div>
              </div>
              <div className="rounded-[18px] bg-[#f8fbf8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Current status
                </p>
                <div className="mt-2">
                  <AdminStatusBadge
                    label={activeRecord.status}
                    tone={toneForStatus(activeRecord.status)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-[#e5ebe7] bg-[#fbfdfb] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Uploaded identity document
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View the submitted document quickly or download it for closer review.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={activeRecord.proofHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[#cfe2d5] px-3 py-2 text-xs font-semibold text-[#0f7b36] transition hover:bg-[#eef8f1]"
                  >
                    View
                  </a>
                  <a
                    href={activeRecord.proofHref}
                    download={activeRecord.proofName}
                    className="rounded-xl border border-[#cfe2d5] px-3 py-2 text-xs font-semibold text-[#0f7b36] transition hover:bg-[#eef8f1]"
                  >
                    Download
                  </a>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[18px] border border-[#e5ebe7] bg-white">
                {activeProofIsImage ? (
                  <img
                    src={activeRecord.proofHref}
                    alt={`${activeRecord.id} uploaded KYC document`}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center px-4 text-center text-sm text-slate-500">
                    <p className="font-semibold text-slate-700">Preview unavailable</p>
                    <p className="mt-1">Download the document to review this file.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] bg-[#f8fbf8] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Admin note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{activeRecord.notes}</p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Quick Action
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["Pending", "Flagged", "Approved"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={isUpdating}
                    onClick={() => void updateStatus(activeRecord.id, status)}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      activeRecord.status === status
                        ? status === "Approved"
                          ? "bg-emerald-600 text-white"
                          : status === "Flagged"
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
          </div>
        </div>
      ) : null}
    </>
  );
}
