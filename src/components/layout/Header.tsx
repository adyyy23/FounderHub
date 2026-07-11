import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, Settings, LogOut, User, Check, Trash2, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, type Notification as NotificationType } from '@/services/notifications';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClickOutside = (e: MouseEvent) => {
    if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
      setShowNotifications(false);
    }
    if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
      setShowUserMenu(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const [all, unread] = await Promise.all([
        notificationService.getAll(10),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(all);
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      await notificationService.markAsUnread(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read_at: null } : n))
      );
      setUnreadCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to mark as unread:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const notificationTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'action':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <header className="fixed top-0 left-[210px] right-0 h-[60px] bg-[#0d0d0d] border-b border-[#1e1e1e] flex items-center px-6 gap-4 z-10">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-[400px]">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4b5563]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, investor, metric..."
            className="w-full bg-[#161616] border border-[#1e1e1e] rounded-lg pl-9 pr-4 py-2 text-sm text-[#9ca3af] placeholder-[#4b5563] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:text-white transition-colors"
          />
        </div>
      </form>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          to="/ideas"
          className="flex items-center gap-2 bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#1a1a1a] rounded-lg px-4 py-2 text-sm text-white font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.98]"
        >
          <Plus size={14} />
          Quick Action
        </Link>

        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center bg-[#161616] border border-[#1e1e1e] rounded-lg text-[#9ca3af] hover:text-white hover:border-[#2a2a2a] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.95]"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-[#1e1e1e] rounded-xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                  >
                    <Check size={12} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[#6b7280] text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'w-full text-left px-4 py-3 border-b border-[#1a1a1a] hover:bg-[#1a1a1a] transition-colors group',
                        !notification.read_at && 'bg-[#1a1008]'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                            notificationTypeColor(notification.type)
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">
                            {notification.title}
                          </p>
                          {notification.message && (
                            <p className="text-[11px] text-[#6b7280] truncate">
                              {notification.message}
                            </p>
                          )}
                          <p className="text-[10px] text-[#4b5563] mt-1">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {notification.read_at ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsUnread(notification.id); }}
                              className="text-[#4b5563] hover:text-white p-1"
                              title="Mark as unread"
                            >
                              <Mail size={11} />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                              className="text-[#4b5563] hover:text-white p-1"
                              title="Mark as read"
                            >
                              <Check size={11} />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                            className="text-[#4b5563] hover:text-red-400 p-1"
                            title="Delete"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#2a2a2a] hover:border-orange-500 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 active:scale-[0.95]"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center">
                <User size={16} className="text-[#4b5563]" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#0d0d0d] rounded-full" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#141414] border border-[#1e1e1e] rounded-xl shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1e1e1e]">
                <p className="text-sm font-semibold text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-[#6b7280] truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-white hover:bg-[#1a1a1a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                >
                  <Settings size={14} />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#9ca3af] hover:text-red-400 hover:bg-[#1a1a1a] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
