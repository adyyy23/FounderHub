import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Building2, Mail, MapPin, Tag, FileText, Loader as Loader2, Check } from 'lucide-react';
import { investorService, type InvestorStage } from '@/services/investors';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stages: { value: InvestorStage; label: string }[] = [
  { value: 'SOURCED', label: 'Sourced' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'INTERESTED', label: 'Interested' },
  { value: 'NEGOTIATING', label: 'Negotiating' },
  { value: 'SIGNED', label: 'Signed' },
  { value: 'PASSED', label: 'Passed' },
];

const sentiments = ['Bullish', 'Hot', 'Neutral', 'Cold'];

export default function AddInvestor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    stage: 'SOURCED' as InvestorStage,
    sentiment: 'Neutral',
    commitment: '',
    location: '',
    focusAreas: '',
    notes: '',
    linkedinUrl: '',
    typicalCheckMin: '',
    typicalCheckMax: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }

    setLoading(true);

    try {
      const focusAreas = formData.focusAreas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await investorService.create({
        name: formData.name.trim(),
        firm: formData.firm.trim() || undefined,
        email: formData.email.trim() || undefined,
        stage: formData.stage,
        sentiment: formData.sentiment,
        commitment: formData.commitment ? parseFloat(formData.commitment) : 0,
        location: formData.location.trim() || undefined,
        focus_areas: focusAreas.length > 0 ? focusAreas : undefined,
        notes: formData.notes.trim() || undefined,
        linkedin_url: formData.linkedinUrl.trim() || undefined,
        typical_check_min: formData.typicalCheckMin ? parseFloat(formData.typicalCheckMin) : undefined,
        typical_check_max: formData.typicalCheckMax ? parseFloat(formData.typicalCheckMax) : undefined,
      });

      toast({ title: 'Investor added successfully', description: `${formData.name} has been added to your pipeline.` });
      navigate('/investors');
    } catch (err) {
      console.error('Failed to add investor:', err);
      toast({ title: 'Failed to add investor', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/investors" className="text-[#6b7280] hover:text-white transition-colors flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded">
            <ArrowLeft size={14} />
            Investors
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-1">Add Investor</h1>
        <p className="text-[#6b7280] text-sm mb-8">Add a new investor to your fundraising pipeline.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Investor Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Firm</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                    <Input
                      value={formData.firm}
                      onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                      placeholder="Sequoia Capital"
                      className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@sequoia.com"
                      className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Info */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Pipeline Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as InvestorStage })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    {stages.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Sentiment</label>
                  <select
                    value={formData.sentiment}
                    onChange={(e) => setFormData({ ...formData, sentiment: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  >
                    {sentiments.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Commitment Amount ($)</label>
                <Input
                  type="number"
                  value={formData.commitment}
                  onChange={(e) => setFormData({ ...formData, commitment: e.target.value })}
                  placeholder="500000"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Typical Check Min ($)</label>
                  <Input
                    type="number"
                    value={formData.typicalCheckMin}
                    onChange={(e) => setFormData({ ...formData, typicalCheckMin: e.target.value })}
                    placeholder="100000"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Typical Check Max ($)</label>
                  <Input
                    type="number"
                    value={formData.typicalCheckMax}
                    onChange={(e) => setFormData({ ...formData, typicalCheckMax: e.target.value })}
                    placeholder="500000"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Focus Areas / Industry (comma-separated)</label>
                <div className="relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.focusAreas}
                    onChange={(e) => setFormData({ ...formData, focusAreas: e.target.value })}
                    placeholder="SaaS, AI, Enterprise"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">LinkedIn URL</label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-[#4b5563]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Notes</h2>
            <div>
              <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Investor Notes</label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-[#4b5563]" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes about this investor, their thesis, portfolio fit, etc."
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg pl-10 pr-3 py-2 text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#3a3a3a]"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              to="/investors"
              className="text-[#6b7280] hover:text-white text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} className="mr-2" /> Add Investor</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
