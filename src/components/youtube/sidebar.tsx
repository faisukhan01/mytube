'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  ShoppingBag,
  Music2,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  Lightbulb,
  Shirt,
  Youtube,
  Settings,
  Flag,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  History,
  ListVideo,
  Shield,
  Download,
  Smartphone,
  Tv,
  Crown,
  X,
  Send,
  ExternalLink,
  MonitorPlay,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useState } from 'react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  view?: string;
  category?: string;
  dialogId?: string;
}

const mainItems: SidebarItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', view: 'home' },
  { icon: <Compass className="w-5 h-5" />, label: 'Explore', view: 'trending' },
  { icon: <PlaySquare className="w-5 h-5" />, label: 'Shorts', view: 'shorts' },
  { icon: <ListVideo className="w-5 h-5" />, label: 'Subscriptions', view: 'subscriptions' },
];

const youItems: SidebarItem[] = [
  { icon: <History className="w-5 h-5" />, label: 'History', view: 'history' },
  { icon: <PlaySquare className="w-5 h-5" />, label: 'Your videos', view: 'home' },
  { icon: <Clock className="w-5 h-5" />, label: 'Watch later', view: 'watchlater' },
  { icon: <ThumbsUp className="w-5 h-5" />, label: 'Liked videos', view: 'liked' },
];

const exploreItems: SidebarItem[] = [
  { icon: <Flame className="w-5 h-5" />, label: 'Trending', view: 'trending' },
  { icon: <ShoppingBag className="w-5 h-5" />, label: 'Shopping', category: 'Shopping' },
  { icon: <Music2 className="w-5 h-5" />, label: 'Music', category: 'Music' },
  { icon: <Film className="w-5 h-5" />, label: 'Movies', category: 'Movies' },
  { icon: <Radio className="w-5 h-5" />, label: 'Live', category: 'Live' },
  { icon: <Gamepad2 className="w-5 h-5" />, label: 'Gaming', category: 'Gaming' },
  { icon: <Newspaper className="w-5 h-5" />, label: 'News', category: 'News' },
  { icon: <Trophy className="w-5 h-5" />, label: 'Sports', category: 'Sports' },
  { icon: <Lightbulb className="w-5 h-5" />, label: 'Learning', category: 'Learning' },
  { icon: <Shirt className="w-5 h-5" />, label: 'Fashion & Beauty', category: 'Fashion' },
];

const moreItems: SidebarItem[] = [
  { icon: <Youtube className="w-5 h-5" />, label: 'YouTube Premium', dialogId: 'premium' },
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', dialogId: 'settings' },
  { icon: <Flag className="w-5 h-5" />, label: 'Report history', dialogId: 'reports' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', dialogId: 'help' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Send feedback', dialogId: 'feedback' },
];

type DialogId = 'premium' | 'settings' | 'reports' | 'help' | 'feedback' | null;

export default function YouTubeSidebar() {
  const { sidebarOpen, currentView, setCurrentView, goHome, sidebarMini, setSelectedCategory } = useYouTubeStore();
  const [activeDialog, setActiveDialog] = useState<DialogId>(null);

  // Settings state
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');

  const handleItemClick = (item: SidebarItem) => {
    if (item.dialogId) {
      setActiveDialog(item.dialogId as DialogId);
      return;
    }
    if (item.category) {
      setSelectedCategory(item.category);
      setCurrentView('home');
      return;
    }
    if (item.view) {
      if (item.view === 'home') {
        goHome();
      } else {
        setCurrentView(item.view as Parameters<typeof setCurrentView>[0]);
      }
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    toast.success('Thank you for your feedback!');
    setFeedbackText('');
    setActiveDialog(null);
  };

  const premiumFeatures = [
    { icon: <Shield className="w-5 h-5" />, title: 'Ad-free videos', desc: 'Watch videos without interruptions' },
    { icon: <Download className="w-5 h-5" />, title: 'Offline downloads', desc: 'Download videos to watch offline' },
    { icon: <Smartphone className="w-5 h-5" />, title: 'Background play', desc: 'Listen while using other apps' },
    { icon: <Tv className="w-5 h-5" />, title: 'YouTube Music Premium', desc: 'Ad-free music streaming' },
    { icon: <MonitorPlay className="w-5 h-5" />, title: 'YouTube Kids', desc: 'Ad-free & offline in YouTube Kids' },
  ];

  const helpTopics = [
    { title: 'Get started with YouTube', desc: 'Learn the basics of using YouTube' },
    { title: 'Troubleshoot video playback issues', desc: 'Fix problems playing videos' },
    { title: 'Manage your account settings', desc: 'Update your profile and preferences' },
    { title: 'Community Guidelines', desc: 'Learn about our policies and rules' },
    { title: 'Privacy & Safety', desc: 'Manage your privacy and safety settings' },
    { title: 'Copyright & Rights Management', desc: 'Understand copyright on YouTube' },
  ];

  // Mini sidebar (collapsed)
  if (sidebarMini && !sidebarOpen) {
    return (
      <aside className="fixed left-0 top-14 bottom-0 w-[72px] bg-white dark:bg-[#0f0f0f] z-40 overflow-y-auto hidden md:flex flex-col items-center pt-1 pb-4">
        {mainItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleItemClick(item)}
            className={`flex flex-col items-center justify-center w-full py-4 px-1 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
              currentView === item.view ? 'font-medium' : ''
            }`}
          >
            <div className={`${currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-1.5 text-gray-700 dark:text-gray-400 leading-tight">{item.label}</span>
          </button>
        ))}
      </aside>
    );
  }

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => useYouTubeStore.getState().toggleSidebar()}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-[240px] bg-white dark:bg-[#0f0f0f] z-40 overflow-y-auto transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'
        }`}
      >
        <div className="py-3 px-3">
          {/* Main items */}
          {mainItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* You section */}
          <div className="flex items-center gap-1 px-3 mb-1">
            <span className="text-base text-gray-800 dark:text-gray-200 font-medium">You</span>
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          {youItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* Explore section */}
          <h3 className="px-3 mb-1 text-base text-gray-800 dark:text-gray-200 font-medium">Explore</h3>
          {exploreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* More from YouTube */}
          <h3 className="px-3 mb-1 text-base text-gray-800 dark:text-gray-200 font-medium">More from YouTube</h3>
          {moreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-6 w-full px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-3 dark:bg-gray-700" />

          {/* Footer */}
          <div className="px-3 py-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              About Press Copyright Contact us Creators Advertise Developers
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
              Terms Privacy Policy & Safety How YouTube works Test new features
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">© 2024 Google LLC</p>
          </div>
        </div>
      </aside>

      {/* YouTube Premium Dialog */}
      <Dialog open={activeDialog === 'premium'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-red-600" />
              YouTube Premium
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enjoy uninterrupted videos and more with YouTube Premium. Get the best of YouTube with these benefits:
            </p>
            <div className="space-y-3">
              {premiumFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-red-600 mt-0.5">{feature.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{feature.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Starting at $13.99/month</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Free for 1 month, cancel anytime</p>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full">
              Get YouTube Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={activeDialog === 'settings'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Autoplay</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Automatically play the next video</p>
              </div>
              <Switch checked={autoplay} onCheckedChange={setAutoplay} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Notifications</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive push notifications</p>
              </div>
              <Switch checked={notifications} onCheckedChange={(checked) => {
                setNotifications(checked);
                toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
              }} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Language</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred language</p>
              </div>
              <Select value={language} onValueChange={(val) => {
                setLanguage(val);
                const langNames: Record<string, string> = {
                  en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch', ja: '日本語', ko: '한국어', pt: 'Português', zh: '中文',
                };
                toast.success(`Language changed to ${langNames[val] || val}`);
              }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900 dark:text-white">Restricted Mode</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hide potentially mature content</p>
              </div>
              <Switch onCheckedChange={(checked) => {
                toast.success(checked ? 'Restricted Mode enabled' : 'Restricted Mode disabled');
              }} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report History Dialog */}
      <Dialog open={activeDialog === 'reports'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Report history
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Flag className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base font-medium">No reports</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 text-center">
              Videos you report will appear here. You can view the status of your reports at any time.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={activeDialog === 'help'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Help
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {helpTopics.map((topic) => (
              <button
                key={topic.title}
                onClick={() => toast.success(`Opening: ${topic.title}`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{topic.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{topic.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-center justify-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <button
              onClick={() => setActiveDialog('feedback')}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Send feedback
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Feedback Dialog */}
      <Dialog open={activeDialog === 'feedback'} onOpenChange={(open) => {
        if (!open) {
          setFeedbackText('');
        }
        setActiveDialog(open ? 'feedback' : null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Send feedback
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback" className="text-sm font-medium text-gray-900 dark:text-white">
                Tell us what you think
              </Label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Share your thoughts, report issues, or suggest improvements
              </p>
              <Textarea
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Describe your experience or share a suggestion..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Some account and system information may be sent to YouTube. We will use this information to improve our products and services.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setFeedbackText('');
                setActiveDialog(null);
              }}
              className="dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
