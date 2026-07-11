import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LifeBuoy,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Rocket,
  UserCog,
  Handshake,
  Target,
  Brain,
  Plug,
  MessageSquare,
  Send,
} from 'lucide-react';

const quickLinks = [
  { icon: Rocket, title: 'Getting Started', desc: 'Set up your workspace and connect your first integrations.' },
  { icon: UserCog, title: 'Account & Billing', desc: 'Manage your subscription, seats, and payment methods.' },
  { icon: Handshake, title: 'Investor Pipeline', desc: 'Track investors from cold intro to wired funds.' },
  { icon: Target, title: 'Goal Setting', desc: 'Build cascading OKRs that align every team to strategy.' },
  { icon: Brain, title: 'AI Advisor', desc: 'Surface strategic risks and opportunities with AI guidance.' },
  { icon: Plug, title: 'Integrations', desc: 'Connect Stripe, QuickBooks, and your CRM to FounderHub.' },
];

const faqs = [
  {
    q: 'How do I connect my first data source?',
    a: 'Navigate to Settings → Integrations and select the service you want to connect (Stripe, QuickBooks, HubSpot, etc.). Follow the OAuth flow to authorize FounderHub. Most integrations activate within a few minutes, and live telemetry begins flowing into your Mission Control immediately.',
  },
  {
    q: 'Can I invite my co-founder and team members?',
    a: 'Yes. From Settings → Team, you can invite members by email and assign roles. Operators get full write access, advisors get read-only views, and you can create custom roles on the Series A+ plan. Each plan includes a set number of seats — additional seats can be added at any time.',
  },
  {
    q: 'How does the AI Advisor generate recommendations?',
    a: 'The AI Advisor cross-references your connected metrics, investor pipeline, and goal progress against a dataset of 10,000+ startup trajectories. It surfaces anomalies (such as burn-rate spikes), flags at-risk goals, and suggests next actions. Recommendations are informational and should be reviewed before acting.',
  },
  {
    q: 'What happens to my data if I cancel my subscription?',
    a: 'After cancellation, your account remains active until the end of the current billing cycle. You then have a 60-day grace period to export your data from Settings → Export. After that window, your data is permanently deleted in accordance with our Privacy Policy.',
  },
  {
    q: 'How do I upgrade or downgrade my plan?',
    a: 'Go to Settings → Billing to view available plans. Upgrades take effect immediately and are prorated. Downgrades take effect at the start of your next billing cycle. If you need help choosing the right plan, contact our team and we will walk you through the options.',
  },
  {
    q: 'Is my financial data shared with third parties?',
    a: 'No. We never sell or share your data. We only share data with service providers (such as our cloud host and payment processor) under strict contractual protections. See our Privacy Policy for full details on how your data is handled.',
  },
  {
    q: 'Can I export my investor pipeline and goals?',
    a: 'Yes. From any list view, use the Export button to download your data as CSV or JSON. The Settings → Export page lets you download a full archive of your workspace, including investor records, goals, metrics history, and AI Advisor notes.',
  },
  {
    q: 'What support is included with my plan?',
    a: 'The Seed Pilot plan includes email support with a typical response time of 1 business day. The Series A+ Commander plan includes priority email and chat support with a 4-hour response window. Enterprise Fleet customers receive a dedicated success advisor and 24/7 support.',
  },
];

export default function SupportCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#0d0d0d]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-0.5 -m-0.5 active:scale-[0.98] transition-transform">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">FounderHub</span>
          </Link>
          <Link
            to="/login"
            className="text-[#9ca3af] hover:text-white text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#1e1e1e] rounded-full px-3 py-1 mb-6">
            <LifeBuoy size={12} className="text-orange-500" />
            <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest">Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">Support Center</h1>
          <p className="text-[#6b7280] text-sm leading-relaxed max-w-xl">
            Find answers to common questions, explore key topics, and reach our team when you need a hand.
            We are here to help you get the most out of FounderHub.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <Mail size={16} className="text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-white">Email Support</h3>
            </div>
            <p className="text-[#9ca3af] text-sm mb-2">Reach us anytime at</p>
            <a href="mailto:support@founderhub.io" className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
              support@founderhub.io
            </a>
          </div>
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-white">Response Time</h3>
            </div>
            <p className="text-[#9ca3af] text-sm mb-2">Typical first response</p>
            <p className="text-white text-sm font-medium">Within 1 business day</p>
          </div>
        </div>

        {/* Quick links */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-5">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <div
                  key={link.title}
                  className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4 hover:border-[#2a2a2a] transition-colors cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-1">{link.title}</h3>
                      <p className="text-[#6b7280] text-xs leading-relaxed">{link.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ accordion */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-5">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#141414] border border-[#1e1e1e] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-[#161616] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm font-semibold text-white pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-[#6b7280] flex-shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-[#6b7280] flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-[#1e1e1e] pt-3">
                    <p className="text-sm text-[#9ca3af] leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Still need help CTA */}
        <section className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare size={18} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">Still need help?</h3>
              <p className="text-[#9ca3af] text-sm leading-relaxed mb-4">
                Our support team is ready to help with account issues, billing questions, and technical problems.
                Include as much detail as possible so we can resolve your request quickly.
              </p>
              <a
                href="mailto:support@founderhub.io?subject=FounderHub%20Support%20Request"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Send size={14} />
                Contact Support
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-[#1e1e1e]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[#4b5563] text-xs">© 2025 FounderHub — Mission Control for Founders</span>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[#4b5563] hover:text-white text-xs transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-[#4b5563] hover:text-white text-xs transition-colors">Terms of Service</Link>
              <Link to="/support" className="text-[#4b5563] hover:text-white text-xs transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
