import Link from "next/link";
import { AppShell } from "../../components/shell";
import {
  adminMetrics,
  dashboardTransactions,
  homeRates,
  orderStatus,
  quickActions,
  recentUsers,
  systemSummary,
  testimonials,
} from "../../lib/mock-data";
import { Icon } from "../../components/icons";
import { AdminCard, AdminSectionIntro, AdminStatusBadge } from "../../components/admin-ui";
import { RatesBoard } from "../../components/rates-board";
import {
  fetchAdminBuy4MeOrders,
  fetchAdminDashboardMetrics,
  fetchAdminTransactions,
  fetchAdminUsers,
  fetchRates,
  formatCurrency,
  formatRelativeTime,
  mapBackendRatesToBoard,
} from "../../lib/admin-backend";

const metricTints = ["emerald", "violet", "sky", "amber", "pink"] as const;

export default async function AdminPage() {
  const [dashboardData, transactions, users, buy4meOrders, rates] = await Promise.allSettled([
    fetchAdminDashboardMetrics(),
    fetchAdminTransactions(),
    fetchAdminUsers(),
    fetchAdminBuy4MeOrders(),
    fetchRates(),
  ]);

  const liveTransactions =
    transactions.status === "fulfilled" ? transactions.value : [];
  const liveUsers = users.status === "fulfilled" ? users.value : [];
  const liveBuy4MeOrders =
    buy4meOrders.status === "fulfilled" ? buy4meOrders.value : [];
  const liveRates =
    rates.status === "fulfilled"
      ? mapBackendRatesToBoard(rates.value)
      : homeRates.map((rate, index) => ({ id: `fallback-${index}`, ...rate }));

  const metrics =
    dashboardData.status === "fulfilled"
      ? [
          {
            label: "Total Users",
            value: dashboardData.value.totalUsers.toLocaleString(),
            trend: "Live user count from backend",
            tint: metricTints[0],
          },
          {
            label: "Total Transactions",
            value: dashboardData.value.totalTransactions.toLocaleString(),
            trend: "All recorded transactions",
            tint: metricTints[1],
          },
          {
            label: "Total Deposits",
            value: formatCurrency(dashboardData.value.totalDeposits),
            trend: "Confirmed deposits volume",
            tint: metricTints[2],
          },
          {
            label: "Total Withdrawals",
            value: formatCurrency(dashboardData.value.totalWithdrawals),
            trend: "Confirmed withdrawals volume",
            tint: metricTints[3],
          },
          {
            label: "Buy 4 Me Orders",
            value: liveBuy4MeOrders.length.toLocaleString(),
            trend: "Orders created on the platform",
            tint: metricTints[4],
          },
        ]
      : adminMetrics;

  const recentTransactions =
    liveTransactions.length > 0
      ? liveTransactions.slice(0, 4).map((item) => {
          const user = liveUsers.find((entry) => entry.id === item.userId);
          const labelPrefix = item.type === "DEPOSIT" ? "Deposit from" : "Withdrawal to";

          return {
            id: item.id,
            service: `${labelPrefix} ${user?.fullName ?? "Unknown user"}`,
            meta: item.service,
            amount: formatCurrency(item.nairaEquivalent),
            status:
              item.status === "CONFIRMED"
                ? "Completed"
                : item.status === "REJECTED"
                  ? "Rejected"
                  : "Pending",
          };
        })
      : dashboardTransactions;

  const recentUsersData =
    liveUsers.length > 0
      ? liveUsers.slice(0, 4).map((user) => ({
          name: user.fullName,
          email: user.email,
          status: user.kycStatus === "APPROVED" ? "Verified" : "Unverified",
          time: formatRelativeTime(user.createdAt),
        }))
      : recentUsers;

  const liveOrderStatus = [
    {
      label: "Processing",
      value: liveBuy4MeOrders.filter((item) =>
        ["PROCESSING", "AWAITING_PAYMENT", "PAYMENT_SUBMITTED"].includes(item.status),
      ).length,
      color: "bg-orange-500",
    },
    {
      label: "In Progress",
      value: liveBuy4MeOrders.filter((item) =>
        ["PURCHASING", "SHIPPED"].includes(item.status),
      ).length,
      color: "bg-blue-600",
    },
    {
      label: "Completed",
      value: liveBuy4MeOrders.filter((item) => item.status === "COMPLETED").length,
      color: "bg-emerald-600",
    },
  ];

  const liveSystemSummary =
    dashboardData.status === "fulfilled"
      ? [
          { label: "Pending Requests", value: dashboardData.value.pendingRequests },
          {
            label: "Pending Deposits",
            value: liveTransactions.filter(
              (item) => item.type === "DEPOSIT" && item.status === "PENDING",
            ).length,
          },
          {
            label: "Pending Withdrawals",
            value: liveTransactions.filter(
              (item) => item.type === "WITHDRAWAL" && item.status === "PENDING",
            ).length,
          },
          {
            label: "Unverified Users",
            value: liveUsers.filter((item) => item.kycStatus !== "APPROVED").length,
          },
          {
            label: "Buy 4 Me Pending",
            value: liveBuy4MeOrders.filter((item) => item.status !== "COMPLETED").length,
          },
        ]
      : systemSummary;

  return (
    <AppShell admin activeSlug="admin" title="Welcome back, Admin" subtitle="Here is what is happening with your platform today.">
      <section className="space-y-6">
        <AdminSectionIntro
          eyebrow="Admin Hub"
          title="Run approvals, manage customers, and monitor every service from one command center."
          description="The admin dashboard gives you a live platform snapshot, then links you straight into transactions, bonuses, users, support, KYC, and service operations."
        />

        <div className="grid gap-4 xl:grid-cols-5">
          {(metrics.length > 0 ? metrics : []).map((metric) => (
            <AdminCard key={metric.label} className="rounded-[24px] p-5">
              <div className="flex items-center gap-3">
                <span className={`rounded-2xl p-3 ${
                  metric.tint === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : metric.tint === "violet"
                      ? "bg-violet-50 text-violet-600"
                      : metric.tint === "sky"
                        ? "bg-sky-50 text-sky-600"
                        : metric.tint === "amber"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-pink-50 text-pink-600"
                }`}>
                  <Icon
                    name={
                      metric.label.includes("Users")
                        ? "users"
                        : metric.label.includes("Transactions")
                          ? "swap"
                          : metric.label.includes("Deposits")
                            ? "bank"
                            : metric.label.includes("Withdrawals")
                              ? "arrow"
                              : "bag"
                    }
                    className="h-5 w-5"
                  />
                </span>
                <div>
                  <p className="text-sm text-slate-500">{metric.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{metric.value}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-[#0f7b36]">{metric.trend}</p>
            </AdminCard>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <AdminCard>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Transaction Overview</h2>
                  <p className="text-sm text-slate-500">Deposits, withdrawals and Buy 4 Me performance this month.</p>
                </div>
                <Link href="/admin/transactions" className="rounded-xl border border-[#d7e2db] px-4 py-2 text-sm font-semibold text-slate-700">
                  Open queue
                </Link>
              </div>
              <div className="rounded-[24px] bg-[#fbfcfb] p-5">
                <div className="mb-4 flex gap-5 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Deposits</span>
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Withdrawals</span>
                  <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Buy 4 Me</span>
                </div>
                <div className="grid h-[240px] grid-cols-12 items-end gap-2">
                  {[36, 44, 40, 68, 64, 70, 81, 74, 78, 69, 55, 72].map((value, index) => (
                    <div key={value + index} className="flex h-full items-end gap-1">
                      <div className="w-2 rounded-full bg-emerald-500/85" style={{ height: `${value}%` }} />
                      <div className="w-2 rounded-full bg-amber-400/85" style={{ height: `${Math.max(20, value - 24)}%` }} />
                      <div className="w-2 rounded-full bg-violet-400/85" style={{ height: `${Math.max(10, value - 42)}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Live Exchange Rates</h2>
                <Link href="/admin/rates" className="rounded-xl bg-[#0f7b36] px-4 py-2 text-sm font-semibold text-white">Edit Rates</Link>
              </div>
              <RatesBoard rates={liveRates} admin actionHref="/admin/rates" />
            </AdminCard>

            <AdminCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Latest Testimonials</h2>
                <Link href="/admin/testimonials" className="rounded-xl border border-[#d7e2db] px-4 py-2 text-sm font-semibold text-slate-700">Manage All</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {testimonials.map((item) => (
                  <div key={item.name} className="rounded-[22px] border border-[#edf1ee] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-[#0f7b36]">{item.badge}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.quote}</p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>

          <div className="space-y-5">
            <AdminCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <Link href="/admin/transactions" className="text-sm font-semibold text-[#0f7b36]">View All</Link>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                        <Icon name="arrow" className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.service}</p>
                        <p className="text-xs text-slate-500">{item.meta}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.amount}</p>
                      <div className="mt-1">
                        <AdminStatusBadge
                          label={item.status}
                          tone={
                            item.status === "Completed"
                              ? "success"
                              : item.status === "Rejected"
                                ? "danger"
                                : "warning"
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <h2 className="text-xl font-semibold">Order Status (Buy 4 Me)</h2>
              <div className="mt-6 flex items-center gap-5">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#f97316_0_25%,#2563eb_25%_68%,#059669_68%_100%)]">
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center">
                    <p className="text-3xl font-semibold">1245</p>
                    <p className="text-xs text-slate-500">Total Orders</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {(liveBuy4MeOrders.length > 0 ? liveOrderStatus : orderStatus).map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm">
                      <span className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="w-24 text-slate-600">{item.label}</span>
                      <span className="font-semibold text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/admin/buy4me" className="mt-5 inline-flex text-sm font-semibold text-[#0f7b36]">Open order desk</Link>
            </AdminCard>

            <AdminCard>
              <h2 className="text-xl font-semibold">System Summary</h2>
              <div className="mt-4 space-y-3">
                {liveSystemSummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <h2 className="text-xl font-semibold">Quick Actions</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="rounded-2xl border border-[#e5ebe7] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#c8ddd0] hover:text-[#0f7b36]"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </AdminCard>

            <AdminCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Users</h2>
                <Link href="/admin/users" className="text-sm font-semibold text-[#0f7b36]">View All</Link>
              </div>
              <div className="space-y-4">
                {recentUsersData.map((user) => (
                  <div key={user.email} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${user.status === "Verified" ? "text-[#0f7b36]" : "text-amber-600"}`}>
                        {user.status}
                      </p>
                      <p className="text-xs text-slate-400">{user.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
