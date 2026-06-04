import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "../../components/homepage-motion";
import { PublicShell } from "../../components/public-shell";
import { Icon } from "../../components/icons";

export default function SupportPage() {
  return (
    <PublicShell>
      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <Reveal mode="load">
          <div className="rounded-[28px] bg-[linear-gradient(180deg,#f7faf8_0%,#eef5f0_100%)] p-5 shadow-[0_20px_50px_rgba(15,23,32,0.05)] sm:p-7 md:rounded-[34px] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
              We&apos;re Here To Help You
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl md:text-6xl">
              Discuss your payment and service support needs
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              Reach out for deposit issues, withdrawal delays, Buy4Me requests,
              rate questions, or general platform guidance. Our team will point
              you to the right next step quickly.
            </p>

            <Stagger className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
              {[
                {
                  title: "E-mail",
                  value: "support@ofenetworks.ng",
                  text: "Best for proof review, transaction follow-up, and detailed support requests.",
                  icon: "chat" as const,
                },
                {
                  title: "Contact Us",
                  value: "+234 800 000 0000",
                  text: "Use this line for urgent support coordination and account-related guidance.",
                  icon: "bell" as const,
                },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex items-start gap-3 rounded-[20px] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,32,0.04)] sm:gap-4 sm:rounded-[24px] sm:p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 sm:h-12 sm:w-12">
                      <Icon name={item.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-400 sm:text-sm">
                        {item.title}
                      </p>
                      <p className="mt-1 break-words text-lg font-semibold text-slate-900 sm:text-2xl">
                        {item.value}
                      </p>
                      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 sm:leading-7">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/register"
                className="rounded-2xl bg-[#0f7b36] px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-[#d8e3dc] bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700"
              >
                Log In
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal mode="load" delay={0.08}>
          <div className="rounded-[28px] border border-[#e7eee9] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,32,0.06)] sm:p-7 md:rounded-[34px] md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Contact us
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:leading-7">
              Send your details and message, and our team will follow up with the right support path.
            </p>

            <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
              <div>
                <label
                  htmlFor="support-name"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Name
                </label>
                <input
                  id="support-name"
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full rounded-2xl border border-[#e7eee9] bg-[#f8fbf8] px-4 py-3 text-sm text-slate-800 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="support-email"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  placeholder="jane@ofenetworks.ng"
                  className="w-full rounded-2xl border border-[#e7eee9] bg-[#f8fbf8] px-4 py-3 text-sm text-slate-800 outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="support-topic"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Support topic
                </label>
                <select
                  id="support-topic"
                  className="w-full rounded-2xl border border-[#e7eee9] bg-[#f8fbf8] px-4 py-3 pr-12 text-sm text-slate-700 outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select...
                  </option>
                  <option>Deposit issue</option>
                  <option>Withdrawal delay</option>
                  <option>Buy4Me request</option>
                  <option>Rate question</option>
                  <option>General support</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="support-message"
                  className="mb-2 block text-sm font-medium text-slate-600"
                >
                  Message
                </label>
                <textarea
                  id="support-message"
                  rows={6}
                  placeholder="Type your message"
                  className="w-full resize-none rounded-2xl border border-[#e7eee9] bg-[#f8fbf8] px-4 py-3 text-sm text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0f7b36] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,123,54,0.2)] sm:w-auto"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0f7b36]">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
                Contact us
              </button>
            </form>
          </div>
        </Reveal>
      </section>
    </PublicShell>
  );
}
