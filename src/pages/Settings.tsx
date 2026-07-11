import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Building, Briefcase, Globe, Linkedin, Twitter, Camera, Loader as Loader2, Check, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profiles';
import { notificationPreferencesService, type NotificationPreferencesUpdate } from '@/services/notificationPreferences';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    role: '',
    bio: '',
    website_url: '',
    linkedin_url: '',
    twitter_url: '',
  });
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferencesUpdate>({
    email_notifications: true,
    product_updates: true,
    investor_alerts: true,
    team_notifications: true,
  });
  const [notifLoading, setNotifLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company_name: profile.company_name || '',
        role: profile.role || '',
        bio: profile.bio || '',
        website_url: profile.website_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    loadNotifPrefs();
  }, []);

  const loadNotifPrefs = async () => {
    try {
      const prefs = await notificationPreferencesService.get();
      if (prefs) {
        setNotifPrefs({
          email_notifications: prefs.email_notifications,
          product_updates: prefs.product_updates,
          investor_alerts: prefs.investor_alerts,
          team_notifications: prefs.team_notifications,
        });
      }
    } catch (err) {
      console.error('Failed to load notification preferences:', err);
    }
  };

  const handleNotifToggle = async (key: keyof NotificationPreferencesUpdate, value: boolean) => {
    const updated = { ...notifPrefs, [key]: value };
    setNotifPrefs(updated);
    setNotifLoading(true);
    try {
      await notificationPreferencesService.upsert(updated);
      toast({ title: 'Notification preferences updated' });
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      toast({ title: 'Failed to update preferences', variant: 'destructive' });
      setNotifPrefs(notifPrefs);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSaved(false);

    try {
      await profileService.update(user.id, {
        full_name: formData.full_name || undefined,
        company_name: formData.company_name || undefined,
        role: formData.role || undefined,
        bio: formData.bio || undefined,
        website_url: formData.website_url || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        twitter_url: formData.twitter_url || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    try {
      const avatarUrl = await profileService.uploadAvatar(file);
      await profileService.update(user.id, { avatar_url: avatarUrl });
      window.location.reload();
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-[#6b7280] text-sm">Manage your profile and preferences</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2a]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#1e1e1e] border-2 border-[#2a2a2a] flex items-center justify-center">
                  <User size={32} className="text-[#4b5563]" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-400 transition-colors">
                <Camera size={14} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="text-sm text-white mb-1">Upload a new photo</p>
              <p className="text-xs text-[#6b7280]">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Your full name"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-[#6b7280] cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-[#4b5563] mt-1">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Company</label>
                  <div className="relative">
                    <Building size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Company name"
                      className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Role</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Your role"
                      className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={3}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#3a3a3a]"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Website</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">LinkedIn</label>
                <div className="relative">
                  <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#6b7280] mb-1.5 block">Twitter</label>
                <div className="relative">
                  <Twitter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
                  <Input
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/username"
                    className="bg-[#1a1a1a] border-[#2a2a2a] pl-10 text-white placeholder-[#4b5563]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : saved ? <><Check size={16} className="mr-2" /> Saved</> : 'Save Changes'}
            </Button>
          </div>
        </form>

        {/* Notification Preferences */}
        <div className="mt-8 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} className="text-orange-400" />
            <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
          </div>
          <p className="text-xs text-[#6b7280] mb-6">Choose what updates you want to receive. Changes are saved automatically.</p>
          <div className="space-y-5">
            {([
              { key: 'email_notifications', label: 'Email Notifications', desc: 'General account and security emails' },
              { key: 'product_updates', label: 'Product Updates', desc: 'New features and improvements' },
              { key: 'investor_alerts', label: 'Investor Alerts', desc: 'Pipeline changes and investor activity' },
              { key: 'team_notifications', label: 'Team Notifications', desc: 'Team member updates and assignments' },
            ] as { key: keyof NotificationPreferencesUpdate; label: string; desc: string }[]).map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-[#6b7280]">{item.desc}</div>
                </div>
                <Switch
                  checked={notifPrefs[item.key]}
                  onCheckedChange={(checked) => handleNotifToggle(item.key, checked)}
                  disabled={notifLoading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-[#141414] border border-red-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-xs text-[#6b7280] mb-4">Once you sign out, you'll need to sign back in to access your account.</p>
          <Button
            onClick={() => { signOut(); navigate('/'); }}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            Sign Out
          </Button>
        </div>

        <footer className="mt-10 pt-4 border-t border-[#1e1e1e] flex items-center justify-center gap-6 text-[#4b5563] text-xs">
          <span>2024 FounderHub Mission Control</span>
          <Link to="/privacy" className="hover:text-[#9ca3af] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-[#9ca3af] transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-[#9ca3af] transition-colors">Support</Link>
        </footer>
      </div>
    </div>
  );
}
