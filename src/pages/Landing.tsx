import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Brain, Users, Target, ChartBar as BarChart2, Shield, ArrowRight, CircleCheck as CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Intelligence Layer',
    desc: 'AI-driven strategic analysis that spots burn-rate anomalies before they become crises.',
  },
  {
    icon: Users,
    title: 'Investor CRM',
    desc: 'Full-funnel tracking from cold intro to wired funds. Integrated cap-table simulations.',
  },
  {
    icon: BarChart2,
    title: 'Telemetry Rails',
    desc: 'Real-time data ingestion from Stripe, AWS, and QuickBooks. One source of truth.',
  },
  {
    icon: Target,
    title: 'Goal Architect',
    desc: 'Cascading OKRs that link every line of code to a high-level strategic objective.',
  },
  {
    icon: Shield,
    title: 'Command Vault',
    desc: 'Bank-grade encryption for your most sensitive investor comms and financial data.',
  },
  {
    icon: Zap,
    title: 'Unified Stack',
    desc: 'Consolidate 12+ fragmented tools into a single, high-performance mission control.',
  },
];

const steps = [
  { num: '01', title: 'Connect Your Stack', desc: 'Link Stripe, QuickBooks, and your CRM in minutes. Live telemetry activates automatically.' },
  { num: '02', title: 'Define Your Mission', desc: 'Set OKRs, fundraising targets, and hiring milestones. AI aligns every team action to your strategy.' },
  { num: '03', title: 'Launch with Precision', desc: 'Your advisor surfaces risks before they surface in board meetings. Act early, lead always.' },
];

const pricing = [
  {
    name: 'Seed Pilot',
    price: '$0',
    period: '/month',
    featured: false,
    cta: 'Start Free',
    features: [
      'Single Mission Control',
      'Up to 10 Investor Tracks',
      'Basic Metrics (Stripe only)',
      'Standard Roadmap',
      'Email Support',
    ],
  },
  {
    name: 'Series A+ Commander',
    price: '$499',
    period: '/month',
    featured: true,
    cta: 'Secure Access',
    features: [
      'Unlimited Command Deck',
      'Infinite Investor CRM',
      'Advanced Telemetry AI',
      'Custom Strategy Playbooks',
      '24/7 Priority Support',
      'API Access',
    ],
  },
  {
    name: 'Enterprise Fleet',
    price: '$1,249',
    period: '/month',
    featured: false,
    cta: 'Start Deployment',
    features: [
      'Multi-Entity Aggregation',
      'White-label Investor Portal',
      'Full Cap-Table Management',
      'Dedicated Success Advisor',
      'On-premise Options',
    ],
  },
];

const faqs = [
  {
    q: 'How quickly can I get started?',
    a: 'Most founders complete onboarding in under 20 minutes. Connect your first data source, set your OKRs, and your Mission Control goes live immediately.',
  },
  {
    q: 'Does FounderHub replace my existing tools?',
    a: 'Yes — FounderHub is designed to consolidate Notion, Airtable, HubSpot, and spreadsheets into a single command layer. Integrations are bi-directional.',
  },
  {
    q: 'Is my financial data secure?',
    a: 'Absolutely. We use bank-grade AES-256 encryption, SOC 2 Type II certification, and never sell or share your data with third parties.',
  },
  {
    q: 'Can I invite my co-founder and advisors?',
    a: 'Yes. Every plan includes team seats with granular role-based permissions. Advisors get read-only views; operators get full write access.',
  },
  {
    q: 'What makes the AI Advisor different?',
    a: 'Our AI is trained on 10,000+ startup trajectories. It doesn\'t just surface metrics — it cross-references them against investor sentiment and market conditions to produce actionable strategic guidance.',
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e1e] bg-[#080808]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="text-white font-semibold text-[15px] tracking-tight">FounderHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[#6b7280] hover:text-white text-sm font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-[#6b7280] hover:text-white text-sm font-medium transition-colors">Pricing</a>
            <a href="#faq" className="text-[#6b7280] hover:text-white text-sm font-medium transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[#9ca3af] hover:text-white text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full pulse-dot" />
            <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest">
              Phase 2.0 Mission Control Is Live
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6 uppercase">
            The Operating System<br />
            For Founders Who<br />
            <span className="text-orange-500">Ship.</span>
          </h1>

          <p className="text-[#6b7280] text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Integrate fundraising, growth metrics, and strategic execution into a single high-fidelity command deck.
            Stop juggling spreadsheets; start leading.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-orange-500/20"
            >
              Initialize Launch
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/login"
              className="text-[#9ca3af] hover:text-white font-medium text-sm transition-colors"
            >
              View Demo Deck
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-[#1e1e1e] bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '$2.4B+', label: 'Capital Raised' },
            { value: '15k', label: 'Active Founders' },
            { value: '94%', label: 'Series A Velocity' },
            { value: '120+', label: 'Top-Tier VCs' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-[11px] font-medium text-[#6b7280] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mission Health Card */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">Mission Health</span>
              </div>
              <p className="text-xs text-[#6b7280] mb-4">Near-real-time telemetry of your startup's core vitals. Runway, burn, and ARR synchronized.</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280]">Health Score</span>
                  <span className="text-lg font-bold text-orange-400">86%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#6b7280]">Runway</span>
                  <span className="text-sm font-bold text-white">14.2 months</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6b7280]">ARR</span>
                  <div className="flex-1 h-0.5 bg-[#2a2a2a] rounded-full">
                    <div className="h-full w-[60%] bg-orange-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-white font-semibold">$1.2M</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6b7280]">Burn</span>
                  <div className="flex-1 h-0.5 bg-[#2a2a2a] rounded-full">
                    <div className="h-full w-[40%] bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-white font-semibold">$84K</span>
                </div>
              </div>
            </div>

            {/* Investor Command Card */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Investor Command</span>
              </div>
              <p className="text-xs text-[#6b7280] mb-4">A high-velocity CRM built for fundraising rounds. Manage intros, docs, and closures.</p>
              <div className="space-y-2">
                <div className="text-[10px] text-[#4b5563] uppercase mb-1">Active Round: Series A</div>
                {[
                  { name: 'Andreessen Al.', status: 'Contacted', dot: 'bg-yellow-400' },
                  { name: 'Sequoia Cap.', status: 'Interested', dot: 'bg-green-400' },
                  { name: "Founders Fund", status: 'Term Sheet', dot: 'bg-orange-400' },
                ].map((inv) => (
                  <div key={inv.name} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-2.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${inv.dot}`} />
                      <span className="text-[11px] text-[#9ca3af]">{inv.name}</span>
                    </div>
                    <span className="text-[10px] text-white font-medium">{inv.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Timeline Card */}
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-5 hover:border-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Strategic Timeline</span>
              </div>
              <p className="text-xs text-[#6b7280] mb-4">Align your team with a roadmap that prioritizes outcomes over mere features.</p>
              <div className="space-y-2">
                {[
                  { label: 'Multi-Currency SSO', pct: 85, color: 'bg-orange-500' },
                  { label: 'Investor CRM Pro', pct: 60, color: 'bg-blue-500' },
                  { label: 'AI Insight Engine', pct: 35, color: 'bg-green-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-[#9ca3af]">{item.label}</span>
                      <span className="text-[#6b7280]">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#2a2a2a] rounded-full">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Built for the Relentless */}
      <section id="features" className="py-24 px-6 bg-[#0d0d0d] border-y border-[#1e1e1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built for the Relentless.</h2>
            <p className="text-[#6b7280] text-base max-w-md mx-auto">
              We've automated the back-office noise so you can focus on building the future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat) => (
              <div key={feat.title} className="group">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <feat.icon size={18} className="text-orange-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Command In 3 Steps.</h2>
            <p className="text-[#6b7280] text-base max-w-sm mx-auto">
              From zero to operational clarity in under an hour.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-6xl font-black text-[#1a1a1a] mb-4 select-none">{step.num}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-[#0d0d0d] border-y border-[#1e1e1e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Select Your Command Tier.</h2>
            <p className="text-[#6b7280] text-base">Scalable infrastructure for every stage of the founder journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.featured
                    ? 'bg-orange-500/5 border-orange-500/30 relative'
                    : 'bg-[#111111] border-[#1e1e1e]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className="text-sm font-bold text-[#6b7280] mb-2">{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-[#6b7280] text-sm mb-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5 text-sm text-[#9ca3af]">
                      <CheckCircle size={13} className={plan.featured ? 'text-orange-400' : 'text-green-400'} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    plan.featured
                      ? 'bg-orange-500 hover:bg-orange-400 text-white'
                      : 'bg-[#1e1e1e] hover:bg-[#252525] text-white border border-[#2a2a2a]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="text-[#2a2a2a] text-2xl">&#10022;</span>
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-white leading-snug mb-8">
            "FounderHub didn't just organize my business; it changed how I think as a CEO.
            I went from reactive chaos to strategic command in 6 weeks."
          </blockquote>
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-wider mb-0.5">Sarah Jenkins</div>
            <div className="text-xs text-[#6b7280] uppercase tracking-wider">Founder of NexaHealth (Raised $55M)</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-[#0d0d0d] border-t border-[#1e1e1e]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white text-center mb-12">Common Questions.</h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp size={16} className="text-[#6b7280] flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown size={16} className="text-[#6b7280] flex-shrink-0 ml-4" />
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
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-orange-500 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 opacity-80" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
                Ready for<br />Lift Off?
              </h2>
              <p className="text-orange-100 text-sm mb-8 max-w-sm mx-auto">
                Join 15,000+ founders who are redefining startup operations. Your mission control awaits.
              </p>
              <Link
                to="/signup"
                className="inline-block bg-white hover:bg-orange-50 text-orange-600 font-bold text-sm px-8 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                Initialize Free Command
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e1e] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[#4b5563] text-xs">2024 FounderHub Mission Control</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#4b5563] hover:text-[#6b7280] text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-[#4b5563] hover:text-[#6b7280] text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-[#4b5563] hover:text-[#6b7280] text-xs transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
