import {
  Zap,
  Brain,
  Users,
  Target,
  ChartBar as BarChart2,
  Shield,
  type LucideIcon,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────── */
/* Typed interfaces                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

export interface LandingFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface LandingStep {
  num: string;
  title: string;
  desc: string;
}

export interface LandingPricingPlan {
  name: string;
  price: string;
  period: string;
  featured: boolean;
  cta: string;
  features: string[];
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingStat {
  value: string;
  label: string;
}

export interface LandingTestimonial {
  quote: string;
  author: string;
  role: string;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Content constants                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

export const features: LandingFeature[] = [
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

export const steps: LandingStep[] = [
  { num: '01', title: 'Connect Your Stack', desc: 'Link Stripe, QuickBooks, and your CRM in minutes. Live telemetry activates automatically.' },
  { num: '02', title: 'Define Your Mission', desc: 'Set OKRs, fundraising targets, and hiring milestones. AI aligns every team action to your strategy.' },
  { num: '03', title: 'Launch with Precision', desc: 'Your advisor surfaces risks before they surface in board meetings. Act early, lead always.' },
];

export const pricing: LandingPricingPlan[] = [
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

export const faqs: LandingFaq[] = [
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

export const stats: LandingStat[] = [
  { value: '$2.4B+', label: 'Capital Raised' },
  { value: '15k', label: 'Active Founders' },
  { value: '94%', label: 'Series A Velocity' },
  { value: '120+', label: 'Top-Tier VCs' },
];

export const testimonials: LandingTestimonial[] = [
  {
    quote: "FounderHub didn't just organize my business; it changed how I think as a CEO. I went from reactive chaos to strategic command in 6 weeks.",
    author: 'Sarah Jenkins',
    role: 'Founder of NexaHealth (Raised $55M)',
  },
];
