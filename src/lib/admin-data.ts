export type AdminSectionSlug =
  | "transactions"
  | "buy4me"
  | "users"
  | "bonuses"
  | "rates"
  | "services"
  | "testimonials"
  | "tickets"
  | "notifications"
  | "kyc"
  | "settings"
  | "payment"
  | "security";

function createProofDataUrl(id: string, service: string, amount: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <rect width="1200" height="760" rx="32" fill="#f4fbf6"/>
      <rect x="42" y="42" width="1116" height="676" rx="28" fill="#ffffff" stroke="#dce9df"/>
      <text x="88" y="116" fill="#0f7b36" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">Payment Proof</text>
      <text x="88" y="166" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">Transaction ID: ${id}</text>
      <text x="88" y="216" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">Service: ${service}</text>
      <text x="88" y="266" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">Amount: ${amount}</text>
      <rect x="88" y="322" width="1024" height="262" rx="24" fill="#f8fbf8" stroke="#dce9df" stroke-dasharray="10 8"/>
      <text x="600" y="455" text-anchor="middle" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600">Uploaded receipt preview</text>
      <text x="600" y="500" text-anchor="middle" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="22">Mock attachment for admin review flow</text>
      <rect x="88" y="620" width="300" height="48" rx="16" fill="#eaf7ee"/>
      <text x="112" y="651" fill="#0f7b36" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Verified by customer upload</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function createKycDocumentDataUrl(user: string, document: string, status: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760">
      <rect width="1200" height="760" rx="32" fill="#f5faf7"/>
      <rect x="48" y="48" width="1104" height="664" rx="28" fill="#ffffff" stroke="#dce9df"/>
      <text x="92" y="120" fill="#0f7b36" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="700">KYC Document Preview</text>
      <text x="92" y="174" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">User: ${user}</text>
      <text x="92" y="220" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">Document: ${document}</text>
      <text x="92" y="266" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="24">Current status: ${status}</text>
      <rect x="92" y="322" width="1016" height="246" rx="22" fill="#f8fbf8" stroke="#dce9df" stroke-dasharray="10 8"/>
      <text x="600" y="442" text-anchor="middle" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="600">Uploaded identity document snapshot</text>
      <text x="600" y="488" text-anchor="middle" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="22">Mock file for admin verification flow</text>
      <rect x="92" y="612" width="286" height="48" rx="16" fill="#eaf7ee"/>
      <text x="116" y="643" fill="#0f7b36" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">Identity verification attachment</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const adminSectionMeta: Record<
  AdminSectionSlug,
  { title: string; subtitle: string; eyebrow: string; description: string }
> = {
  transactions: {
    title: "Transactions",
    subtitle: "Review deposits, withdrawals, and manual confirmations.",
    eyebrow: "Operations",
    description: "Monitor all incoming proofs, pending payouts, and confirmation history from one clean queue.",
  },
  buy4me: {
    title: "Buy 4 Me Orders",
    subtitle: "Track sourcing, shipping, payment, and fulfilment updates.",
    eyebrow: "Orders",
    description: "Handle request intake, costing, payment approval, and customer delivery updates without leaving the admin workspace.",
  },
  users: {
    title: "Users",
    subtitle: "Search, review, and manage customer accounts.",
    eyebrow: "Accounts",
    description: "Keep an eye on user activity, verification state, referral performance, and account quality across the platform.",
  },
  bonuses: {
    title: "Bonuses",
    subtitle: "Manage referral percentages and qualification thresholds.",
    eyebrow: "Rewards",
    description: "Control how customer bonuses are assigned based on referral source, transaction minimums, and percentage bands.",
  },
  rates: {
    title: "Exchange Rates",
    subtitle: "Update deposit and withdrawal rates across services.",
    eyebrow: "Pricing",
    description: "Maintain a transparent rate board for every supported service and publish changes quickly.",
  },
  services: {
    title: "Services",
    subtitle: "Review modules, availability, and operational status.",
    eyebrow: "Platform",
    description: "See which services are live, what needs attention, and where future expansion can slot into the platform.",
  },
  testimonials: {
    title: "Testimonials",
    subtitle: "Approve, reject, and publish customer feedback.",
    eyebrow: "Reputation",
    description: "Moderate reviews before they go live so the storefront stays trusted and professionally curated.",
  },
  tickets: {
    title: "Support Tickets",
    subtitle: "Respond to customer issues and escalations.",
    eyebrow: "Support",
    description: "Stay ahead of deposit disputes, delay complaints, and Buy4Me follow-ups with a clean queue and clear ownership.",
  },
  notifications: {
    title: "Notifications",
    subtitle: "Broadcast updates and keep admins informed.",
    eyebrow: "Messaging",
    description: "Review outgoing announcements, operational alerts, and customer-facing messages from one place.",
  },
  kyc: {
    title: "KYC Verification",
    subtitle: "Approve identities and reduce fraud risk.",
    eyebrow: "Compliance",
    description: "Track pending KYC submissions, flagged identities, and the documents needing review or escalation.",
  },
  settings: {
    title: "General Settings",
    subtitle: "Control platform defaults and admin preferences.",
    eyebrow: "Configuration",
    description: "Manage working hours, dashboard defaults, automation toggles, and brand-level operational settings.",
  },
  payment: {
    title: "Payment Details",
    subtitle: "Manage payout channels and receiving accounts.",
    eyebrow: "Finance",
    description: "Keep bank details, digital account handles, and service-specific receiving information up to date.",
  },
  security: {
    title: "Security",
    subtitle: "Track access, sessions, and high-risk actions.",
    eyebrow: "Protection",
    description: "Review login events, privileged actions, and any suspicious patterns that deserve immediate attention.",
  },
};

export const adminTransactionsData = [
  {
    id: "DEP-3021",
    user: "John Doe",
    service: "Crypto (USDT TRC20)",
    type: "Deposit",
    amount: "N250,000",
    status: "Pending",
    time: "2 mins ago",
    paymentReference: "TRX-992841",
    proofName: "DEP-3021-proof.svg",
    proofHref: createProofDataUrl("DEP-3021", "Crypto (USDT TRC20)", "N250,000"),
  },
  {
    id: "WDR-1844",
    user: "Mary A.",
    service: "PayPal",
    type: "Withdrawal",
    amount: "N175,000",
    status: "Confirmed",
    time: "18 mins ago",
    paymentReference: "PP-1844-889",
    proofName: "WDR-1844-proof.svg",
    proofHref: createProofDataUrl("WDR-1844", "PayPal", "N175,000"),
  },
  {
    id: "DEP-3017",
    user: "Daniel E.",
    service: "Skrill",
    type: "Deposit",
    amount: "N96,000",
    status: "Rejected",
    time: "42 mins ago",
    paymentReference: "SK-3017-223",
    proofName: "DEP-3017-proof.svg",
    proofHref: createProofDataUrl("DEP-3017", "Skrill", "N96,000"),
  },
  {
    id: "WDR-1832",
    user: "Kelvin O.",
    service: "Deriv",
    type: "Withdrawal",
    amount: "N210,000",
    status: "Pending",
    time: "1 hour ago",
    paymentReference: "DRV-1832-110",
    proofName: "WDR-1832-proof.svg",
    proofHref: createProofDataUrl("WDR-1832", "Deriv", "N210,000"),
  },
] as const;

export const adminBuy4MeOrders = [
  {
    id: "B4M-1201",
    customer: "Ada N.",
    item: "iPhone 15 Pro Max",
    total: "$1,120",
    status: "Awaiting Payment",
    eta: "Quote sent 20 mins ago",
    source: "Apple Store US",
    paymentMethod: "Bank Transfer",
    note: "Customer has received the quote and is expected to complete payment today.",
  },
  {
    id: "B4M-1200",
    customer: "Kehinde B.",
    item: "Fashion bundle",
    total: "$285",
    status: "Processing",
    eta: "Warehouse pickup tomorrow",
    source: "ASOS UK",
    paymentMethod: "USDT TRC20",
    note: "Supplier confirmed item availability and the pickup request is already scheduled.",
  },
  {
    id: "B4M-1198",
    customer: "Yusuf T.",
    item: "Auto parts set",
    total: "$540",
    status: "Completed",
    eta: "Delivered yesterday",
    source: "eBay Motors",
    paymentMethod: "PayPal",
    note: "Order fulfilled successfully and customer delivery confirmation has been received.",
  },
];

export const adminUsersData = [
  { name: "John Doe", email: "john@example.com", referrals: 8, volume: "N1.2M", bonus: "8%", status: "Verified" },
  { name: "Mary A.", email: "mary@example.com", referrals: 3, volume: "N650k", bonus: "5%", status: "Verified" },
  { name: "Kelvin O.", email: "kelvin@example.com", referrals: 12, volume: "N2.8M", bonus: "12%", status: "VIP" },
  { name: "Sarah J.", email: "sarah@example.com", referrals: 0, volume: "N80k", bonus: "0%", status: "Review" },
];

export const adminBonusRules = [
  { tier: "Starter Referral", minimum: "N50,000", rate: "5%", appliesTo: "Verified referred users" },
  { tier: "Growth Referral", minimum: "N250,000", rate: "8%", appliesTo: "Users with repeat qualified transactions" },
  { tier: "Partner Referral", minimum: "N1,000,000", rate: "12%", appliesTo: "High-volume referred customers" },
];

export const adminServiceHealth = [
  { service: "Deriv", uptime: "99.4%", volume: "High", status: "Live" },
  { service: "Crypto", uptime: "99.7%", volume: "High", status: "Live" },
  { service: "Skrill", uptime: "97.8%", volume: "Medium", status: "Watch" },
  { service: "PayPal", uptime: "98.9%", volume: "High", status: "Live" },
  { service: "Venmo", uptime: "96.6%", volume: "Medium", status: "Watch" },
  { service: "Payoneer", uptime: "98.1%", volume: "Medium", status: "Live" },
  { service: "Buy 4 Me", uptime: "100%", volume: "Growing", status: "Live" },
];

export const adminTestimonialsQueue = [
  {
    id: "TES-101",
    name: "Blessing U.",
    service: "Crypto payout",
    text: "Fast payout and super clear updates all through.",
    status: "Pending Review",
    submittedAt: "12 mins ago",
  },
  {
    id: "TES-099",
    name: "Michael F.",
    service: "Buy4Me delivery",
    text: "Buy4Me was easier than I expected, smooth delivery.",
    status: "Approved",
    submittedAt: "42 mins ago",
  },
  {
    id: "TES-095",
    name: "Rita K.",
    service: "Deriv funding",
    text: "Need quicker confirmation at night, but rates are good.",
    status: "Rejected",
    submittedAt: "1 hour ago",
  },
] as const;

export const adminTicketsData = [
  {
    id: "SUP-201",
    subject: "Delayed Skrill confirmation",
    user: "Mary A.",
    priority: "High",
    owner: "Tosin",
    status: "Open",
    channel: "Dashboard chat",
    updatedAt: "6 mins ago",
    summary:
      "Customer says the Skrill payment proof was uploaded 25 minutes ago, but the balance has not been updated.",
    conversation: [
      {
        sender: "Mary A.",
        time: "10:14 AM",
        text: "Hi, I uploaded my Skrill receipt but I still have not received confirmation.",
      },
      {
        sender: "Support Bot",
        time: "10:15 AM",
        text: "Your ticket has been queued for admin review.",
      },
    ],
  },
  {
    id: "SUP-198",
    subject: "Wrong bank account name",
    user: "Daniel E.",
    priority: "Medium",
    owner: "Shola",
    status: "Pending User",
    channel: "Email",
    updatedAt: "22 mins ago",
    summary:
      "Customer reported that the payout account name displayed in the withdrawal screen does not match their submitted details.",
    conversation: [
      {
        sender: "Daniel E.",
        time: "9:42 AM",
        text: "The account name showing for my withdrawal is different from what I entered. Please check.",
      },
      {
        sender: "Shola",
        time: "9:50 AM",
        text: "Please resend the correct account name exactly as it appears on your bank profile.",
      },
    ],
  },
  {
    id: "SUP-194",
    subject: "Buy4Me quote update",
    user: "Ada N.",
    priority: "Low",
    owner: "Mide",
    status: "Resolved",
    channel: "WhatsApp handoff",
    updatedAt: "1 hour ago",
    summary:
      "Customer needed confirmation that the updated Buy4Me quote already includes shipping and doorstep delivery.",
    conversation: [
      {
        sender: "Ada N.",
        time: "8:18 AM",
        text: "Please confirm whether the latest quote includes shipping to Lagos.",
      },
      {
        sender: "Mide",
        time: "8:31 AM",
        text: "Yes, the revised quote already includes shipping and local delivery. Marking this as resolved.",
      },
    ],
  },
] as const;

export const adminNotificationsData = [
  { title: "Rate update published", audience: "All users", channel: "Dashboard", status: "Sent", time: "10 mins ago" },
  { title: "Bonus qualification reminder", audience: "Eligible users", channel: "Dashboard + Email", status: "Scheduled", time: "Today, 5:00 PM" },
  { title: "KYC backlog alert", audience: "Admins", channel: "Realtime", status: "Live", time: "Now" },
];

export const adminKycData = [
  {
    id: "KYC-1102",
    user: "Favour A.",
    document: "NIN Slip",
    risk: "Low",
    status: "Pending",
    submittedAt: "12 mins ago",
    proofName: "KYC-1102-nin-slip.svg",
    proofHref: createKycDocumentDataUrl("Favour A.", "NIN Slip", "Pending"),
    notes: "Clear capture, but name formatting should match the account exactly.",
  },
  {
    id: "KYC-1098",
    user: "Joseph P.",
    document: "Passport",
    risk: "Medium",
    status: "Flagged",
    submittedAt: "34 mins ago",
    proofName: "KYC-1098-passport.svg",
    proofHref: createKycDocumentDataUrl("Joseph P.", "Passport", "Flagged"),
    notes: "Photo is visible, but expiry date needs a second look before approval.",
  },
  {
    id: "KYC-1087",
    user: "Linda M.",
    document: "Driver's License",
    risk: "Low",
    status: "Approved",
    submittedAt: "1 hour ago",
    proofName: "KYC-1087-drivers-license.svg",
    proofHref: createKycDocumentDataUrl("Linda M.", "Driver's License", "Approved"),
    notes: "Document passed all manual review checks.",
  },
] as const;

export const adminSettingsData = [
  { label: "Business Hours", value: "08:00 - 22:00 WAT" },
  { label: "Default Review SLA", value: "15 minutes" },
  { label: "Notification Sound", value: "Enabled" },
  { label: "Auto Rate Refresh", value: "Every 30 minutes" },
];

export const adminPaymentData = [
  { channel: "Bank Transfer", details: "Access Bank PLC | 0761234567", usage: "Deriv, Skrill, PayPal", status: "Primary" },
  { channel: "USDT TRC20", details: "Tron wallet ending ...sjssj", usage: "Crypto", status: "Active" },
  { channel: "PayPal", details: "oreofeoluwatise@yahoo.com", usage: "PayPal withdrawals", status: "Active" },
  { channel: "Venmo", details: "@ofenetworks", usage: "Venmo", status: "Active" },
];

export const adminSecurityEvents = [
  { event: "Admin login", actor: "Admin", location: "Lagos, NG", status: "Successful", time: "5 mins ago" },
  { event: "Rate board updated", actor: "Admin", location: "Lagos, NG", status: "Tracked", time: "18 mins ago" },
  { event: "Suspicious password retry", actor: "Unknown", location: "Abuja, NG", status: "Blocked", time: "1 hour ago" },
];
