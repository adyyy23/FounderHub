import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, Database, Eye, Cookie, Trash2, Share2, Clock } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    body: [
      'We collect information that you provide directly to us when you create an account, use our platform, or contact our support team. This includes your name, email address, company name, and any profile details you choose to add.',
      'We also automatically collect certain data when you use FounderHub, such as your IP address, browser type, device information, and usage analytics. When you connect third-party integrations (such as Stripe, QuickBooks, or your CRM), we receive the data those services expose through their APIs, limited to what is necessary to power your Mission Control.',
      'Sensitive financial data, including investor communications and cap-table details, is treated with enhanced protections as described in the Data Security section below.',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    body: [
      'We use your information to provide, maintain, and improve the FounderHub platform. This includes personalizing your dashboard, powering the AI Advisor, surfacing strategic insights, and generating the metrics and reports you rely on to run your company.',
      'We also use your data to communicate with you about product updates, security alerts, and administrative messages. For users on paid plans, we use account details to process payments and manage your subscription.',
      'Aggregated and de-identified data may be used to analyze platform trends, improve our machine-learning models, and develop new features. This data cannot be traced back to an individual user or company.',
    ],
  },
  {
    icon: Share2,
    title: 'Data Sharing & Third Parties',
    body: [
      'We do not sell your personal data or investor information to third parties. We share data only with service providers who help us operate FounderHub — such as cloud hosting, payment processing, and analytics vendors — under contracts that require them to protect your data and use it solely for the purposes we specify.',
      'We may disclose information when required by law, court order, or valid government request, or when we believe disclosure is necessary to protect the rights, property, or safety of FounderHub, our users, or others. In the event of a merger, acquisition, or asset sale, user data may be transferred as a business asset, subject to the protections in this policy.',
      'Third-party integrations you connect are governed by their own privacy policies. We recommend reviewing the privacy practices of any service you link to FounderHub.',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    body: [
      'We protect your data using bank-grade AES-256 encryption at rest and TLS 1.2+ in transit. Access to production systems is restricted to authorized personnel through role-based controls, multi-factor authentication, and detailed audit logging.',
      'FounderHub maintains SOC 2 Type II certification and undergoes regular third-party security assessments. We conduct continuous monitoring for vulnerabilities and have an incident-response plan that includes prompt notification to affected users in the event of a confirmed breach.',
      'Despite these measures, no system can be guaranteed perfectly secure. We encourage you to use strong, unique passwords and enable two-factor authentication on your account.',
    ],
  },
  {
    icon: Cookie,
    title: 'Cookie Policy',
    body: [
      'FounderHub uses cookies and similar tracking technologies to keep you signed in, remember your preferences, and understand how the platform is used. Essential cookies are required for core functionality and cannot be disabled.',
      'Analytics cookies help us identify which features are most valuable and where users encounter friction, so we can prioritize improvements. Advertising cookies are not used on the FounderHub platform.',
      'You can manage or disable non-essential cookies through your browser settings. Note that disabling certain cookies may impact platform functionality, such as session persistence across page reloads.',
    ],
  },
  {
    icon: Shield,
    title: 'Your Rights (GDPR / CCPA)',
    body: [
      'If you are located in the European Economic Area, United Kingdom, or Switzerland, you have the right under the GDPR to access, correct, export, or delete your personal data, and to object to or restrict certain processing. You may also have the right to data portability and to withdraw consent at any time.',
      'If you are a resident of California, the CCPA grants you the right to know what personal information we collect about you, request deletion of that information, and opt out of the sale or sharing of your personal data. FounderHub does not sell personal data as defined by the CCPA.',
      'To exercise any of these rights, contact us at privacy@founderhub.io. We will verify your identity before processing your request and respond within 30 days, as required by applicable law.',
    ],
  },
  {
    icon: Clock,
    title: 'Data Retention',
    body: [
      'We retain your data for as long as your account is active or as needed to provide our services. After account deletion, we remove personal data from production systems within 30 days, though residual copies may persist in encrypted backups for up to 90 days before being permanently purged.',
      'Certain information may be retained for longer periods where required by law, such as financial records related to payment processing or records needed to resolve disputes. Aggregated and de-identified data may be retained indefinitely, as it no longer identifies any individual.',
      'If you cancel a paid subscription, your data remains accessible for 60 days to allow for export. After that grace period, account data is scheduled for deletion unless you reactivate your subscription.',
    ],
  },
  {
    icon: Trash2,
    title: 'Data Deletion',
    body: [
      'You can request deletion of your account and associated data at any time from the Settings page or by contacting our support team. Upon deletion, your Mission Control, investor records, goals, and connected integrations are permanently removed.',
      'Please note that some data may be retained in anonymized form for analytics and model training, where it can no longer be associated with you or your company.',
    ],
  },
];

export default function PrivacyPolicy() {
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
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#141414] border border-[#1e1e1e] rounded-full px-3 py-1 mb-6">
            <Shield size={12} className="text-orange-500" />
            <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-[#6b7280] text-sm">Last updated: July 2025</p>
        </div>

        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 md:p-8 mb-10">
          <p className="text-[#9ca3af] text-sm leading-relaxed">
            This Privacy Policy explains how FounderHub ("we", "us", or "our") collects, uses, and protects your
            information when you use our Mission Control platform and related services. By using FounderHub, you
            agree to the practices described here. We are committed to transparency and to giving you control over
            your data.
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-[#141414] border border-[#1e1e1e] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-orange-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="pl-12 space-y-3">
                  {section.body.map((para, i) => (
                    <p key={i} className="text-[#9ca3af] text-sm leading-relaxed">{para}</p>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Contact section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#141414] border border-[#1e1e1e] rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Contact Us</h2>
            </div>
            <div className="pl-12 space-y-3">
              <p className="text-[#9ca3af] text-sm leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your data, we want to hear from you.
                Our team is available to address privacy concerns, data requests, and security inquiries.
              </p>
              <div className="bg-[#141414] border border-[#1e1e1e] rounded-xl p-4">
                <p className="text-sm text-white font-medium">Privacy Team</p>
                <p className="text-sm text-[#9ca3af] mt-1">Email: privacy@founderhub.io</p>
                <p className="text-sm text-[#9ca3af]">Response time: Within 2 business days</p>
              </div>
            </div>
          </section>
        </div>

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
