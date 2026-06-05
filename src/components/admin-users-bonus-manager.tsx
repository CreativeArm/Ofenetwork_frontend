"use client";

import { useMemo, useState } from "react";
import {
  addUserBonus,
  calculateBonusBalance,
  removeUserBonus,
  type BackendAdminUser,
} from "../lib/admin-backend";
import { notifyBonusBalanceUpdated } from "../lib/bonus-events";
import { useBodyScrollLock } from "../lib/use-body-scroll-lock";
import { AdminStatusBadge } from "./admin-ui";

type BonusType = "REFERRAL_BONUS" | "THRESHOLD_BONUS";

interface AdminUsersBonusManagerProps {
  users: readonly BackendAdminUser[];
}

function formatCurrency(amount: number, currency: "NGN" | "USD" = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatBonusType(type: string) {
  if (type === "REFERRAL_BONUS") {
    return "Referral bonus";
  }
  if (type === "THRESHOLD_BONUS") {
    return "Threshold bonus";
  }
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getActorId() {
  if (typeof window === "undefined") {
    return "admin-local";
  }

  try {
    const rawUser = window.localStorage.getItem("ofe_user");
    const parsed = rawUser ? (JSON.parse(rawUser) as { id?: string }) : null;
    return parsed?.id ?? "admin-local";
  } catch {
    return "admin-local";
  }
}

export function AdminUsersBonusManager({ users }: AdminUsersBonusManagerProps) {
  const [items, setItems] = useState(users);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [bonusType, setBonusType] = useState<BonusType>("REFERRAL_BONUS");
  const [amount, setAmount] = useState("2000");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeUser = useMemo(
    () => items.find((user) => user.id === activeUserId) ?? null,
    [activeUserId, items],
  );

  useBodyScrollLock(Boolean(activeUser));

  const openBonusModal = (user: BackendAdminUser) => {
    setActiveUserId(user.id);
    setBonusType("REFERRAL_BONUS");
    setAmount("2000");
    setFeedback(null);
  };

  const closeBonusModal = () => {
    setActiveUserId(null);
    setBonusType("REFERRAL_BONUS");
    setAmount("2000");
    setFeedback(null);
  };

  const updateWallet = (
    userId: string,
    wallet: NonNullable<BackendAdminUser["wallet"]>,
  ) => {
    setItems((current) =>
      current.map((user) => (user.id === userId ? { ...user, wallet } : user)),
    );
  };

  const activeCredits = (user: BackendAdminUser) =>
    user.wallet?.credits.filter(
      (credit) =>
        ["REFERRAL_BONUS", "THRESHOLD_BONUS"].includes(credit.type) &&
        credit.amount > credit.consumedAmount,
    ) ?? [];

  const addBonus = async () => {
    if (!activeUser) {
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFeedback("Enter a valid bonus amount.");
      return;
    }

    try {
      setIsSaving(true);
      setFeedback(null);
      const wallet = await addUserBonus({
        actorId: getActorId(),
        userId: activeUser.id,
        amount: parsedAmount,
        currency: "NGN",
        type: bonusType,
      });
      updateWallet(activeUser.id, wallet);
      notifyBonusBalanceUpdated(activeUser.id);
      setFeedback("Bonus added successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to add bonus.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeBonus = async (userId: string, creditId: string) => {
    try {
      setIsSaving(true);
      setFeedback(null);
      const wallet = await removeUserBonus({
        actorId: getActorId(),
        userId,
        creditId,
      });
      updateWallet(userId, wallet);
      notifyBonusBalanceUpdated(userId);
      setFeedback("Bonus removed successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to remove bonus.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Customer Directory</h3>
          <p className="text-sm text-slate-500">
            Add referral bonuses or threshold bonuses manually per user.
          </p>
        </div>
        <div className="rounded-xl border border-[#dbe5df] bg-white px-4 py-3 text-sm text-slate-400">
          Threshold rule: N500,000 transaction = N2,000 bonus
        </div>
      </div>

      <div className="space-y-2">
        {items.map((user) => {
          const totalVolume =
            user.transactions?.reduce(
              (sum, transaction) => sum + transaction.nairaEquivalent,
              0,
            ) ?? 0;
          const bonusBalance = calculateBonusBalance(user.wallet);
          const credits = activeCredits(user);

          return (
            <div
              key={user.id}
              className="rounded-[18px] border border-[#edf1ee] px-4 py-3"
            >
              <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.42fr_0.58fr] md:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{user.fullName}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <p className="text-sm text-slate-700">
                  Volume: {formatCurrency(totalVolume)}
                </p>
                <p className="text-sm font-semibold text-[#0f7b36]">
                  Bonus: {formatCurrency(bonusBalance)}
                </p>
                <div className="justify-self-start">
                  <AdminStatusBadge
                    label={user.kycStatus === "APPROVED" ? "Verified" : "Unverified"}
                    tone={user.kycStatus === "APPROVED" ? "success" : "warning"}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => openBonusModal(user)}
                  className="rounded-xl bg-[#0f7b36] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#116f34] md:justify-self-end"
                >
                  Add Bonus
                </button>
              </div>

              {credits.length > 0 ? (
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {credits.map((credit) => {
                    const available = credit.amount - credit.consumedAmount;
                    return (
                      <div
                        key={credit.id}
                        className="flex items-center justify-between gap-3 rounded-2xl bg-[#f8fbf8] px-3 py-2"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatBonusType(credit.type)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Available: {formatCurrency(available, credit.currency)}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => removeBonus(user.id, credit.id)}
                          className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {activeUser ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/18 px-4 backdrop-blur-[2px]"
          onClick={closeBonusModal}
        >
          <div
            className="w-full max-w-[460px] rounded-[28px] border border-[#e5ebe7] bg-white p-5 shadow-[0_28px_80px_rgba(15,23,32,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Add Bonus
                </p>
                <h4 className="mt-2 text-xl font-semibold text-slate-900">
                  {activeUser.fullName}
                </h4>
                <p className="mt-1 text-sm text-slate-500">{activeUser.email}</p>
              </div>
              <button
                type="button"
                onClick={closeBonusModal}
                className="rounded-full border border-[#dbe5df] px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-[#f8fbf8]"
              >
                Close
              </button>
            </div>

            {feedback ? (
              <p className="mt-4 rounded-2xl bg-[#f6faf7] px-4 py-3 text-sm text-slate-700">
                {feedback}
              </p>
            ) : null}

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Bonus type
                </span>
                <select
                  value={bonusType}
                  onChange={(event) => setBonusType(event.target.value as BonusType)}
                  className="w-full rounded-2xl border border-[#e5ebe7] px-4 py-3 text-sm outline-none transition focus:border-[#9bc8aa]"
                >
                  <option value="REFERRAL_BONUS">Referral bonus</option>
                  <option value="THRESHOLD_BONUS">Threshold bonus</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="w-full rounded-2xl border border-[#e5ebe7] px-4 py-3 text-sm outline-none transition focus:border-[#9bc8aa]"
                  placeholder="2000"
                />
              </label>

              {bonusType === "THRESHOLD_BONUS" ? (
                <div className="rounded-2xl bg-[#f8fbf8] px-4 py-3 text-sm text-slate-600">
                  Current threshold rule: add N2,000 after the user reaches N500,000 qualifying volume.
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeBonusModal}
                className="rounded-2xl border border-[#dbe5df] px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-[#f8fbf8]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={addBonus}
                className="rounded-2xl bg-[#0f7b36] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#116f34] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Adding..." : "Add Bonus"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
