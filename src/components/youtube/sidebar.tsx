'use client';

import { useYouTubeStore } from '@/store/youtube-store';
import {
  Home,
  Compass,
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
  Library,
  Shield,
  Download,
  Smartphone,
  Tv,
  Crown,
  X,
  Send,
  ExternalLink,
  MonitorPlay,
  Users,
  Baby,
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
import PlaylistDialog from './playlist-dialog';
import { toast } from 'sonner';
import { useState } from 'react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  view?: string;
  category?: string;
  dialogId?: string;
}

// Custom YouTube Shorts icon - red play button in rounded square
function ShortsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#FF0000" />
      <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="white" />
    </svg>
  );
}

const mainItems: SidebarItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', view: 'home' },
  { icon: <ShortsIcon className="w-5 h-5" />, label: 'Shorts', view: 'shorts' },
  { icon: <Users className="w-5 h-5" />, label: 'Subscriptions', view: 'subscriptions' },
];

const youItems: SidebarItem[] = [
  { icon: <History className="w-5 h-5" />, label: 'History', view: 'history' },
  { icon: <Clock className="w-5 h-5" />, label: 'Watch later', view: 'watchlater' },
  { icon: <Library className="w-5 h-5" />, label: 'Playlists', dialogId: 'playlists' },
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

const moreFromYouTubeItems: SidebarItem[] = [
  { icon: <Youtube className="w-5 h-5 text-red-500" />, label: 'YouTube Premium', dialogId: 'premium' },
  { icon: <Music2 className="w-5 h-5 text-red-500" />, label: 'YouTube Music', category: 'Music' },
  { icon: <Baby className="w-5 h-5 text-red-500" />, label: 'YouTube Kids', category: 'Learning' },
];

const moreItems: SidebarItem[] = [
  { icon: <Settings className="w-5 h-5" />, label: 'Settings', dialogId: 'settings' },
  { icon: <Flag className="w-5 h-5" />, label: 'Report history', dialogId: 'reports' },
  { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', dialogId: 'help' },
  { icon: <MessageSquare className="w-5 h-5" />, label: 'Send feedback', dialogId: 'feedback' },
];

type DialogId = 'premium' | 'settings' | 'reports' | 'help' | 'feedback' | 'playlists' | null;

export default function YouTubeSidebar() {
  const { sidebarOpen, currentView, setCurrentView, goHome, sidebarMini, setSelectedCategory } = useYouTubeStore();
  const [showPlaylistsDialog, setShowPlaylistsDialog] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogId>(null);

  // Settings state
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  // Feedback state
  const [feedbackText, setFeedbackText] = useState('');

  const handleItemClick = (item: SidebarItem) => {
    if (item.dialogId) {
      if (item.dialogId === 'playlists') {
        setShowPlaylistsDialog(true);
      } else {
        setActiveDialog(item.dialogId as DialogId);
      }
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
        <div className="py-2 px-2">
          {/* YouTube Logo at top */}
          <div
            className="flex items-center gap-1.5 px-3 py-3 mb-1 cursor-pointer"
            onClick={goHome}
          >
            <svg viewBox="0 0 90 20" className="h-[20px] w-auto text-[#282828] dark:text-[#f1f1f1]" preserveAspectRatio="xMidYMid meet">
              <g>
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </g>
              <g fill="currentColor">
                <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"/>
                <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5765 39.9058 13.3092V11.3831C39.9058 10.1034 40.0422 9.05518 40.3125 8.23073C40.5853 7.40628 41.0135 6.79146 41.5945 6.38304C42.1779 5.97462 42.9506 5.77051 43.9176 5.77051C44.8682 5.77051 45.6268 5.98108 46.1937 6.40221C46.7605 6.82334 47.1721 7.44525 47.4297 8.26643C47.6873 9.08761 47.8161 10.1359 47.8161 11.4061V13.3322C47.8161 14.5995 47.6849 15.6321 47.4199 16.4294C47.1549 17.2267 46.7378 17.8181 46.1684 18.1991C45.599 18.5826 44.8491 18.773 43.9176 18.773C42.9519 18.773 42.1341 18.5747 41.4697 18.1937ZM44.6353 16.2261C44.7982 15.8266 44.8783 15.2055 44.8783 14.3613V10.3152C44.8783 9.53463 44.7982 8.93554 44.6353 8.51195C44.4724 8.08836 44.1869 7.87779 43.7769 7.87779C43.3814 7.87779 43.105 8.08598 42.9487 8.50494C42.7924 8.92154 42.7142 9.52299 42.7142 10.3152V14.3613C42.7142 15.2055 42.7899 15.8266 42.9393 16.2261C43.0887 16.6256 43.365 16.8264 43.7651 16.8264C44.1746 16.8264 44.4724 16.6256 44.6353 16.2261Z"/>
                <path d="M56.8154 18.5634H54.6094L54.3648 17.0341H54.3037C53.7039 18.1871 52.8055 18.7636 51.6061 18.7636C50.7759 18.7636 50.1621 18.4646 49.7646 17.8665C49.3671 17.2685 49.1696 16.3958 49.1696 15.2484V6.01671H52.0742V14.9495C52.0742 15.5682 52.1288 16.0089 52.2403 16.2721C52.3518 16.5354 52.5464 16.667 52.8252 16.667C53.0559 16.667 53.277 16.5847 53.4887 16.4201C53.7004 16.2555 53.8567 16.0573 53.9575 15.8242V6.01671H56.8154V18.5634Z"/>
                <path d="M64.4755 3.68758H61.6768V18.5634H58.9181V3.68758H56.1194V1.41846H64.4755V3.68758Z"/>
                <path d="M72.6604 18.5634H70.4544L70.2098 17.0341H70.1487C69.5489 18.1871 68.6505 18.7636 67.4511 18.7636C66.6209 18.7636 66.0071 18.4646 65.6096 17.8665C65.2121 17.2685 65.0146 16.3958 65.0146 15.2484V6.01671H67.9192V14.9495C67.9192 15.5682 67.9738 16.0089 68.0853 16.2721C68.1968 16.5354 68.3914 16.667 68.6702 16.667C68.9009 16.667 69.122 16.5847 69.3337 16.4201C69.5454 16.2555 69.7017 16.0573 69.8025 15.8242V6.01671H72.6604V18.5634Z"/>
                <path d="M80.4993 7.69858C80.3098 6.8425 80.0042 6.2265 79.5773 5.84798C79.1529 5.46946 78.5738 5.2802 77.8445 5.2802C77.2746 5.2802 76.7471 5.44478 76.262 5.77159C75.7769 6.0984 75.3994 6.52755 75.1291 7.05862H75.0864V0.913086H72.2692V18.5634H74.6487L74.9524 17.3601H75.0147C75.2638 17.7943 75.6036 18.1297 76.0388 18.3664C76.474 18.6031 76.9508 18.7209 77.4692 18.7209C78.3764 18.7209 79.0581 18.2867 79.5143 17.4183C79.9705 16.5499 80.1975 15.2582 80.1975 13.5419V11.4061C80.1975 10.1467 80.0967 9.0974 79.8951 8.25773C79.7747 7.80233 79.6375 7.3786 79.4825 6.98767H80.4993V7.69858ZM77.3073 13.4265C77.3073 14.2802 77.2679 14.9519 77.1897 15.4418C77.1115 15.9316 76.9827 16.2853 76.8058 16.5006C76.6265 16.7183 76.3843 16.826 76.0768 16.826C75.8346 16.826 75.6135 16.7602 75.4136 16.6286C75.2136 16.4969 75.0573 16.3153 74.9467 16.0835V8.86676C75.0387 8.52463 75.2168 8.23739 75.4798 8.00374C75.7428 7.7701 76.026 7.65328 76.3303 7.65328C76.6306 7.65328 76.8633 7.77247 77.0318 8.00847C77.2003 8.24684 77.3183 8.62536 77.3849 9.1464C77.4515 9.66745 77.4848 10.3831 77.4848 11.2934V13.4265H77.3073Z"/>
                <path d="M84.1498 13.7036C84.1498 14.5259 84.1786 15.1519 84.234 15.5798C84.2895 16.0078 84.3992 16.3145 84.5619 16.4987C84.7246 16.6829 84.9722 16.775 85.3066 16.775C85.7555 16.775 86.0662 16.5857 86.2386 16.2072C86.4111 15.8287 86.5069 15.1886 86.5272 14.2866L89.0745 14.4359C89.0872 14.5688 89.0935 14.7544 89.0935 14.9916C89.0935 16.2498 88.7579 17.2002 88.0866 17.8427C87.4153 18.4852 86.4783 18.8064 85.2759 18.8064C83.8032 18.8064 82.7611 18.3087 82.1497 17.3134C81.5383 16.318 80.8325 14.7628 80.8325 12.6461V11.1903C80.8325 9.05782 81.5406 7.4861 82.1597 6.48735C82.7787 5.4886 83.8381 4.98923 85.3382 4.98923C86.337 4.98923 87.1045 5.19742 87.6426 5.6138C88.1807 6.03019 88.5549 6.65328 88.7651 7.4826C88.9754 8.31192 89.0822 9.40752 89.0822 10.7694V12.741H84.1498V13.7036ZM84.2773 8.15677C84.1215 8.4032 84.0247 8.7859 83.9844 9.30453C83.944 9.82315 83.9242 10.5644 83.9242 11.5274V12.4592H86.4715V11.5274C86.4715 10.5758 86.4517 9.83449 86.4113 9.30846C86.371 8.78244 86.2741 8.39715 86.1184 8.15536C85.9626 7.91358 85.7181 7.79233 85.3838 7.79233C85.0495 7.79233 84.8009 7.91034 84.6382 8.14635L84.2773 8.15677Z"/>
              </g>
            </svg>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-2.5 font-medium">PK</span>
          </div>

          {/* Main items */}
          {mainItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`flex items-center gap-5 w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-2 dark:bg-gray-700" />

          {/* You section */}
          <div className="flex items-center gap-1 px-3 mb-0.5">
            <span className="text-[13px] text-gray-800 dark:text-gray-200 font-medium">You</span>
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          {youItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`flex items-center gap-5 w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors ${
                currentView === item.view ? 'bg-gray-100 dark:bg-[#272727] font-medium' : ''
              }`}
            >
              <span className={currentView === item.view ? 'text-black dark:text-white' : 'text-gray-700 dark:text-gray-400'}>
                {item.icon}
              </span>
              <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-2 dark:bg-gray-700" />

          {/* Explore section */}
          <h3 className="px-3 mb-0.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium">Explore</h3>
          {exploreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-5 w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-2 dark:bg-gray-700" />

          {/* More from YouTube */}
          <h3 className="px-3 mb-0.5 text-[13px] text-gray-800 dark:text-gray-200 font-medium">More from YouTube</h3>
          {moreFromYouTubeItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-5 w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span>{item.icon}</span>
              <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-2 dark:bg-gray-700" />

          {/* Settings & more */}
          {moreItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="flex items-center gap-5 w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors"
            >
              <span className="text-gray-700 dark:text-gray-400">{item.icon}</span>
              <span className="text-[13px] text-gray-800 dark:text-gray-200">{item.label}</span>
            </button>
          ))}

          <Separator className="my-2 dark:bg-gray-700" />

          {/* Footer */}
          <div className="px-3 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              About Press Copyright Contact us Creators Advertise Developers
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
              Terms Privacy Policy & Safety How YouTube works Test new features
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">© 2025 Google LLC</p>
          </div>
        </div>
      </aside>

      {/* Playlists Dialog */}
      <PlaylistDialog
        open={showPlaylistsDialog}
        onOpenChange={setShowPlaylistsDialog}
      />

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
