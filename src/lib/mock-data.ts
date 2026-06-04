export type UserServiceSlug =
  | "dashboard"
  | "deriv"
  | "crypto"
  | "skrill"
  | "paypal"
  | "venmo"
  | "payoneer"
  | "buy4me";

type ManagedServiceSlug = Exclude<UserServiceSlug, "dashboard" | "buy4me">;

export interface ServiceConfig {
  slug: ManagedServiceSlug;
  name: string;
  icon: string;
  accent: string;
  description: string;
  depositTitle: string;
  depositSubtitle: string;
  depositMethodLabel: string;
  depositMethodValue: string;
  depositFields: Array<{
    label: string;
    placeholder: string;
    suffix?: string;
  }>;
  withdrawalTitle: string;
  withdrawalSubtitle: string;
  withdrawalMethodLabel: string;
  withdrawalMethodValue: string;
  withdrawalFields: Array<{
    label: string;
    placeholder: string;
  }>;
}

export const userNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: "grid", slug: "dashboard" },
  { href: "/services/deriv", label: "Deriv", icon: "spark", slug: "deriv" },
  { href: "/services/crypto", label: "Crypto", icon: "coin", slug: "crypto" },
  { href: "/services/skrill", label: "Skrill", icon: "wallet", slug: "skrill" },
  { href: "/services/paypal", label: "PayPal", icon: "paypal", slug: "paypal" },
  { href: "/services/venmo", label: "Venmo", icon: "venmo", slug: "venmo" },
  { href: "/services/payoneer", label: "Payoneer", icon: "ring", slug: "payoneer" },
  { href: "/dashboard/buy4me", label: "Buy4Me", icon: "bag", slug: "buy4me" },
];

export const adminNavigation = [
  { href: "/admin", label: "Dashboard", icon: "grid", group: "main" },
  { href: "/admin/transactions", label: "Transactions", icon: "swap", group: "main" },
  { href: "/admin/buy4me", label: "Buy 4 Me Orders", icon: "bag", group: "main" },
  { href: "/admin/users", label: "Users", icon: "users", group: "main" },
  { href: "/admin/bonuses", label: "Bonuses", icon: "wallet", group: "main" },
  { href: "/admin/rates", label: "Exchange Rates", icon: "chart", group: "main" },
  { href: "/admin/services", label: "Services", icon: "spark", group: "main" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quote", group: "market" },
  { href: "/admin/tickets", label: "Support Tickets", icon: "chat", group: "market" },
  { href: "/admin/notifications", label: "Notifications", icon: "bell", group: "market" },
  { href: "/admin/kyc", label: "KYC Verification", icon: "shield", group: "market" },
  { href: "/admin/settings", label: "General Settings", icon: "gear", group: "settings" },
  { href: "/admin/payment", label: "Payment Details", icon: "bank", group: "settings" },
  { href: "/admin/security", label: "Security", icon: "lock", group: "settings" },
];

export const publicNavigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/buy4me", label: "Buy 4 Me" },
  { href: "/support", label: "Support" },
];

export const bonusBalance = "N24,560.50";

export const serviceConfigs: ServiceConfig[] = [
  {
    slug: "deriv",
    name: "Deriv",
    icon: "spark",
    accent: "bg-rose-50 text-rose-600 border-rose-100",
    description: "Trade synthetic indices and fund your Deriv account with confidence.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Fund your account via bank transfer.",
    depositMethodLabel: "Our Bank Details",
    depositMethodValue: "Access Bank PLC | Ofenetworks Global Solutions | 0761234567",
    depositFields: [
      { label: "Amount (USD)", placeholder: "Enter amount in USD", suffix: "$" },
      { label: "CR Number", placeholder: "Enter CR Number" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Withdraw funds to your bank account.",
    withdrawalMethodLabel: "Withdraw to",
    withdrawalMethodValue: "Ofenetworks Global Solutions",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
  {
    slug: "crypto",
    name: "Crypto",
    icon: "coin",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    description: "Buy, sell, and manage your cryptocurrency transactions.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Deposit USDT (TRC20) to fund your account.",
    depositMethodLabel: "Deposit Method",
    depositMethodValue: "USDT (TRC20)",
    depositFields: [
      { label: "Amount (USD/USDT)", placeholder: "Enter amount in USD or USDT", suffix: "$" },
      { label: "Crypto Address", placeholder: "Enter your crypto wallet address" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Make a withdrawal to your bank account.",
    withdrawalMethodLabel: "Withdrawal to USDT (TRC20) Wallet Address",
    withdrawalMethodValue: "Network: Tron (TRC20) | Wallet: gjsjsjskjsjsjnjsjsnxxhxsjsjssj",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
  {
    slug: "skrill",
    name: "Skrill",
    icon: "wallet",
    accent: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
    description: "Send and receive money securely with Skrill.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Fund your account via Skrill.",
    depositMethodLabel: "Ofenetworks Bank Account to Pay To",
    depositMethodValue: "Access Bank PLC | Ofenetworks Global Solutions | 0761234567",
    depositFields: [
      { label: "Amount (USD)", placeholder: "Enter amount in USD", suffix: "$" },
      { label: "Email Address", placeholder: "Enter your Skrill email address" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Withdraw funds to your bank account.",
    withdrawalMethodLabel: "Send your dollar amount to the details below",
    withdrawalMethodValue: "Name: OoreofeOluwa Oluwatise | Skrill Email: oreofeoluwatise@yahoo.com",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
  {
    slug: "paypal",
    name: "PayPal",
    icon: "paypal",
    accent: "bg-sky-50 text-sky-700 border-sky-100",
    description: "Send and receive money securely with PayPal.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Fund your account via PayPal.",
    depositMethodLabel: "Ofenetworks Bank Account to Pay To",
    depositMethodValue: "Access Bank PLC | Ofenetworks Global Solutions | 0761234567",
    depositFields: [
      { label: "Amount (USD)", placeholder: "Enter amount in USD", suffix: "$" },
      { label: "PayPal Email", placeholder: "Enter your PayPal email address" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Withdraw funds to your bank account.",
    withdrawalMethodLabel: "Send your dollar amount to the details below",
    withdrawalMethodValue: "PayPal Email: oreofeoluwatise@yahoo.com | Account Name: OreofeOluwa Oluwatise",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
  {
    slug: "venmo",
    name: "Venmo",
    icon: "venmo",
    accent: "bg-cyan-50 text-cyan-700 border-cyan-100",
    description: "Request and settle Venmo transactions with quick manual review.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Fund your account via Venmo.",
    depositMethodLabel: "Receiver Details",
    depositMethodValue: "Venmo Tag: @ofenetworks | Account Name: Ofenetworks Global Solutions",
    depositFields: [
      { label: "Amount (USD)", placeholder: "Enter amount in USD", suffix: "$" },
      { label: "Your Venmo Username", placeholder: "Enter your Venmo username" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Withdraw funds to your local bank account.",
    withdrawalMethodLabel: "Send your Venmo amount to",
    withdrawalMethodValue: "Venmo Tag: @ofenetworks",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
  {
    slug: "payoneer",
    name: "Payoneer",
    icon: "ring",
    accent: "bg-orange-50 text-orange-600 border-orange-100",
    description: "Move funds through Payoneer with clear tracking and admin review.",
    depositTitle: "Make a Deposit",
    depositSubtitle: "Submit a Payoneer funding transaction.",
    depositMethodLabel: "Receiver Details",
    depositMethodValue: "Payoneer Email: payments@ofenetworks.ng",
    depositFields: [
      { label: "Amount (USD)", placeholder: "Enter amount in USD", suffix: "$" },
      { label: "Your Payoneer Email", placeholder: "Enter your Payoneer email" },
    ],
    withdrawalTitle: "Make a Withdrawal",
    withdrawalSubtitle: "Cash out to your bank after review.",
    withdrawalMethodLabel: "Send amount to",
    withdrawalMethodValue: "Payoneer Email: payments@ofenetworks.ng",
    withdrawalFields: [
      { label: "Bank Name", placeholder: "Select your bank" },
      { label: "Account Name", placeholder: "Enter account name" },
      { label: "Account Number", placeholder: "Enter account number" },
    ],
  },
];

export const serviceTabs = [
  "deriv",
  "crypto",
  "skrill",
  "paypal",
  "venmo",
  "payoneer",
  "buy4me",
] as const;

export const homeRates = [
  { name: "Deriv", deposit: "N1,650.00 / $1", withdrawal: "N1,720.00 / $1" },
  { name: "Crypto (USDT TRC20)", deposit: "N1,580.00 / $1", withdrawal: "N1,680.00 / $1" },
  { name: "Skrill", deposit: "N1,640.00 / $1", withdrawal: "N1,700.00 / $1" },
  { name: "PayPal", deposit: "N1,650.00 / $1", withdrawal: "N1,720.00 / $1" },
  { name: "Venmo", deposit: "N1,640.00 / $1", withdrawal: "N1,700.00 / $1" },
  { name: "Payoneer", deposit: "N1,645.00 / $1", withdrawal: "N1,710.00 / $1" },
  { name: "Buy 4 Me", deposit: "Custom Quote", withdrawal: "Custom Quote" },
];

export const homeOffers = [
  { title: "Deriv", description: "Trade synthetic indices and global markets with ease.", icon: "deriv" },
  { title: "Crypto", description: "Buy, sell, swap and manage top cryptocurrencies.", icon: "crypto" },
  { title: "PayPal", description: "Make and receive payments quickly and instantly.", icon: "paypal" },
  { title: "Skrill", description: "Fund your account and send money globally with Skrill.", icon: "skrill" },
  { title: "Buy 4 Me", description: "Can not pay for it yourself? We buy it for you.", icon: "buy4me" },
  { title: "More Services", description: "Discover more ways we can help you.", icon: "grid" },
];

export const testimonials = [
  {
    name: "Daniel E.",
    badge: "Verified User",
    quote: "Fast, reliable and trustworthy. My transactions are always successful and support is top-notch.",
  },
  {
    name: "Mary A.",
    badge: "Verified User",
    quote: "I love how easy it is to fund my accounts and swap crypto. Best platform so far.",
  },
  {
    name: "Kelvin O.",
    badge: "Verified User",
    quote: "The exchange rates are the best I have found. Super transparent and very professional.",
  },
];

export const dashboardTransactions = [
  { id: "DEP-1201", service: "Deposit from John Doe", meta: "Crypto (USDT TRC20)", amount: "N50,000.00", status: "Completed" },
  { id: "WDR-2230", service: "Withdrawal to Mary A.", meta: "PayPal", amount: "N75,000.00", status: "Completed" },
  { id: "DEP-1092", service: "Deposit from Daniel E.", meta: "Skrill", amount: "N30,000.00", status: "Completed" },
  { id: "B4M-1021", service: "Buy 4 Me Order #B4M-1021", meta: "Customer Kelvin O.", amount: "N120,450.00", status: "In Progress" },
];

export const adminMetrics = [
  { label: "Total Users", value: "12,458", trend: "+18.6% from last month", tint: "emerald" },
  { label: "Total Transactions", value: "N245,680,500", trend: "+24.3% from last month", tint: "violet" },
  { label: "Total Deposits", value: "N123,560,400", trend: "+20.1% from last month", tint: "sky" },
  { label: "Total Withdrawals", value: "N112,120,100", trend: "+22.7% from last month", tint: "amber" },
  { label: "Buy 4 Me Orders", value: "1,245", trend: "+15.4% from last month", tint: "pink" },
];

export const orderStatus = [
  { label: "Pending", value: 312, color: "bg-orange-500" },
  { label: "In Progress", value: 542, color: "bg-blue-600" },
  { label: "Completed", value: 391, color: "bg-emerald-600" },
];

export const systemSummary = [
  { label: "Pending Deposits", value: 23 },
  { label: "Pending Withdrawals", value: 17 },
  { label: "Open Support Tickets", value: 35 },
  { label: "Unverified Users", value: 47 },
  { label: "Bonus Qualification Alerts", value: 12 },
];

export const quickActions = [
  { label: "Add Exchange Rate", href: "/admin/rates" },
  { label: "Create Notification", href: "/admin/notifications" },
  { label: "Approve KYC", href: "/admin/kyc" },
  { label: "Manage Testimonials", href: "/admin/testimonials" },
  { label: "View All Orders", href: "/admin/buy4me" },
  { label: "System Settings", href: "/admin/settings" },
];

export const recentUsers = [
  { name: "John Doe", email: "john@example.com", status: "Verified", time: "2 mins ago" },
  { name: "Jane Smith", email: "jane.smith@gmail.com", status: "Verified", time: "15 mins ago" },
  { name: "Michael Brown", email: "michael@brown.com", status: "Unverified", time: "45 mins ago" },
  { name: "Sarah Johnson", email: "sarah.j@example.com", status: "Verified", time: "1 hour ago" },
];

export const buy4MeSteps = [
  {
    title: "Submit Link(s)",
    text: "Paste product links and send your request.",
  },
  {
    title: "We Confirm & Quote",
    text: "Our team confirms availability and calculates the total cost.",
  },
  {
    title: "Make Payment",
    text: "Review the total cost, pay and upload your receipt.",
  },
  {
    title: "We Buy & Ship",
    text: "We purchase, ship and deliver to your doorstep.",
  },
];

export const buy4MeCategories = [
  "Electronics (Phones, Laptops, Gadgets)",
  "Vehicles (Cars, Bikes, Trucks)",
  "Machinery & Equipment",
  "Fashion & Accessories",
  "Home Appliances",
  "Furniture",
  "And much more",
];

export const supportReasons = [
  "Transparent Pricing",
  "Real-time Updates",
  "Professional Support",
  "Safe & Secure",
];
