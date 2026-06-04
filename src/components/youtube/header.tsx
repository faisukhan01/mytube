'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  ArrowLeft,
  X,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  MonitorPlay,
  Upload,
  Radio,
  Clapperboard,
  Check,
  Trash2,
  LogIn,
  ArrowUpRight,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import AuthDialog from './auth-dialog';
import UploadDialog from './upload-dialog';

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  const savedTheme = localStorage.getItem('yt-theme');
  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useTheme() {
  const [isDark, setIsDark] = useState(getInitialDarkMode);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('yt-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}

const sampleNotifications = [
  {
    id: '1',
    channelName: 'TechVision',
    channelInitial: 'T',
    channelColor: '#2196F3',
    text: 'uploaded: The Future of AI in 2025',
    timeAgo: '2 hours ago',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    read: false,
  },
  {
    id: '2',
    channelName: 'MusicWorld',
    channelInitial: 'M',
    channelColor: '#E91E63',
    text: 'is live: Concert Night - Best Hits 2024',
    timeAgo: '5 hours ago',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/mqdefault.jpg',
    read: false,
  },
  {
    id: '3',
    channelName: 'CodeAcademy',
    channelInitial: 'C',
    channelColor: '#4CAF50',
    text: 'uploaded: Learn React in 30 Minutes',
    timeAgo: '1 day ago',
    thumbnail: 'https://img.youtube.com/vi/Ke90Tje7VS9A/mqdefault.jpg',
    read: true,
  },
];

export default function YouTubeHeader() {
  const {
    searchQuery,
    toggleSidebar,
    search,
    goHome,
    user,
    toggleAuthDialog,
    showAuthDialog,
    setShowAuthDialog,
    clearUser,
  } = useYouTubeStore();

  const { isDark, toggleTheme } = useTheme();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mobileSuggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Build search suggestions from video data
  const searchSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    const query = inputValue.trim().toLowerCase();
    const seen = new Set<string>();
    const suggestions: string[] = [];

    // Combine all videos for suggestion matching
    const allVideos = [...homeVideos, ...shortsVideos];

    for (const video of allVideos) {
      if (suggestions.length >= 8) break;
      const titleLower = video.title.toLowerCase();
      const channelLower = video.channelTitle.toLowerCase();

      // Match by title containing the query
      if (titleLower.includes(query) && !seen.has(video.title)) {
        seen.add(video.title);
        suggestions.push(video.title);
      }
    }

    // Also match by channel name
    if (suggestions.length < 8) {
      for (const video of allVideos) {
        if (suggestions.length >= 8) break;
        const channelLower = video.channelTitle.toLowerCase();
        if (channelLower.includes(query) && !seen.has(video.channelTitle)) {
          seen.add(video.channelTitle);
          suggestions.push(video.channelTitle);
        }
      }
    }

    return suggestions;
  }, [inputValue]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key to close suggestions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated voice search: after a short delay, show "recognized" text and allow search
  useEffect(() => {
    if (showVoiceSearch && isListening) {
      voiceTimeoutRef.current = setTimeout(() => {
        const phrases = [
          'music videos',
          'cooking tutorials',
          'programming tips',
          'travel vlogs',
          'gaming highlights',
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setVoiceText(randomPhrase);
        setIsListening(false);
      }, 2000);
    }
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, [showVoiceSearch, isListening]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      search(inputValue.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    search(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  const handleMobileSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    search(suggestion);
    setShowSearch(false);
    setShowSuggestions(false);
  };

  const handleLogoClick = () => {
    goHome();
  };

  const handleSignOut = async () => {
    await clearUser();
  };

  const handleVoiceSearch = () => {
    if (voiceText) {
      setInputValue(voiceText);
      search(voiceText);
      setShowVoiceSearch(false);
      setVoiceText('');
      setIsListening(true);
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#0f0f0f] z-50 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div
            className="flex items-center gap-0.5 cursor-pointer shrink-0"
            onClick={handleLogoClick}
          >
            {/* YouTube Logo - Play button icon on mobile, full wordmark on desktop */}
            <div className="flex items-center">
              {/* Mobile: Just the play button icon */}
              <svg viewBox="0 0 28.57 20" className="h-5 w-auto sm:hidden cursor-pointer" preserveAspectRatio="xMidYMid meet" onClick={handleLogoClick}>
                <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
              </svg>
              {/* Desktop: Full wordmark */}
              <svg viewBox="0 0 90 20" className="h-5 w-auto hidden sm:block cursor-pointer" preserveAspectRatio="xMidYMid meet" onClick={handleLogoClick}>
                <g>
                  <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                  <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                </g>
                <g>
                  <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5765 39.9058 13.3092V11.3831C39.9058 10.1034 40.0422 9.05518 40.3125 8.23073C40.5853 7.40628 41.0135 6.79146 41.5945 6.38304C42.1779 5.97462 42.9506 5.77051 43.9176 5.77051C44.8682 5.77051 45.6268 5.98108 46.1937 6.40221C46.7605 6.82334 47.1721 7.44525 47.4297 8.26643C47.6873 9.08761 47.8161 10.1359 47.8161 11.4061V13.3322C47.8161 14.5995 47.6849 15.6321 47.4199 16.4294C47.1549 17.2267 46.7378 17.8181 46.1684 18.1991C45.599 18.5826 44.8491 18.773 43.9176 18.773C42.9519 18.773 42.1341 18.5747 41.4697 18.1937ZM44.6353 16.2261C44.7982 15.8266 44.8783 15.2055 44.8783 14.3613V10.3152C44.8783 9.53463 44.7982 8.93554 44.6353 8.51195C44.4724 8.08836 44.1869 7.87779 43.7769 7.87779C43.3814 7.87779 43.105 8.08598 42.9487 8.50494C42.7924 8.92154 42.7142 9.52299 42.7142 10.3152V14.3613C42.7142 15.2055 42.7899 15.8266 42.9393 16.2261C43.0887 16.6256 43.365 16.8264 43.7651 16.8264C44.1746 16.8264 44.4724 16.6256 44.6353 16.2261Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M56.8154 18.5634H54.6094L54.3648 17.0341H54.3037C53.7039 18.1871 52.8055 18.7636 51.6061 18.7636C50.7759 18.7636 50.1621 18.4646 49.7646 17.8665C49.3671 17.2685 49.1696 16.3958 49.1696 15.2484V6.01671H52.0742V14.9495C52.0742 15.5682 52.1288 16.0089 52.2403 16.2721C52.3518 16.5354 52.5464 16.667 52.8252 16.667C53.0559 16.667 53.277 16.5847 53.4887 16.4201C53.7004 16.2555 53.8567 16.0573 53.9575 15.8242V6.01671H56.8154V18.5634Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M64.4755 3.68758H61.6768V18.5634H58.9181V3.68758H56.1194V1.41846H64.4755V3.68758Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M72.6604 18.5634H70.4544L70.2098 17.0341H70.1487C69.5489 18.1871 68.6505 18.7636 67.4511 18.7636C66.6209 18.7636 66.0071 18.4646 65.6096 17.8665C65.2121 17.2685 65.0146 16.3958 65.0146 15.2484V6.01671H67.9192V14.9495C67.9192 15.5682 67.9738 16.0089 68.0853 16.2721C68.1968 16.5354 68.3914 16.667 68.6702 16.667C68.9009 16.667 69.122 16.5847 69.3337 16.4201C69.5454 16.2555 69.7017 16.0573 69.8025 15.8242V6.01671H72.6604V18.5634Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M80.4993 7.69858C80.3098 6.8425 80.0042 6.2265 79.5773 5.84798C79.1529 5.46946 78.5738 5.2802 77.8445 5.2802C77.2746 5.2802 76.7471 5.44478 76.262 5.77159C75.7769 6.0984 75.3994 6.52755 75.1291 7.05862H75.0864V0.913086H72.2692V18.5634H74.6487L74.9524 17.3601H75.0147C75.2638 17.7943 75.6036 18.1297 76.0388 18.3664C76.474 18.6031 76.9508 18.7209 77.4692 18.7209C78.3764 18.7209 79.0581 18.2867 79.5143 17.4183C79.9705 16.5499 80.1975 15.2582 80.1975 13.5419V11.4061C80.1975 10.1467 80.0967 9.0974 79.8951 8.25773C79.7747 7.80233 79.6375 7.3786 79.4825 6.98767H80.4993V7.69858ZM77.3073 13.4265C77.3073 14.2802 77.2679 14.9519 77.1897 15.4418C77.1115 15.9316 76.9827 16.2853 76.8058 16.5006C76.6265 16.7183 76.3843 16.826 76.0768 16.826C75.8346 16.826 75.6135 16.7602 75.4136 16.6286C75.2136 16.4969 75.0573 16.3153 74.9467 16.0835V8.86676C75.0387 8.52463 75.2168 8.23739 75.4798 8.00374C75.7428 7.7701 76.026 7.65328 76.3303 7.65328C76.6306 7.65328 76.8633 7.77247 77.0318 8.00847C77.2003 8.24684 77.3183 8.62536 77.3849 9.1464C77.4515 9.66745 77.4848 10.3831 77.4848 11.2934V13.4265H77.3073Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                  <path d="M84.1498 13.7036C84.1498 14.5259 84.1786 15.1519 84.234 15.5798C84.2895 16.0078 84.3992 16.3145 84.5619 16.4987C84.7246 16.6829 84.9722 16.775 85.3066 16.775C85.7555 16.775 86.0662 16.5857 86.2386 16.2072C86.4111 15.8287 86.5069 15.1886 86.5272 14.2866L89.0745 14.4359C89.0872 14.5688 89.0935 14.7544 89.0935 14.9916C89.0935 16.2498 88.7579 17.2002 88.0866 17.8427C87.4153 18.4852 86.4783 18.8064 85.2759 18.8064C83.8032 18.8064 82.7611 18.3087 82.1497 17.3134C81.5383 16.318 80.8325 14.7628 80.8325 12.6461V11.1903C80.8325 9.05782 81.5406 7.4861 82.1597 6.48735C82.7787 5.4886 83.8381 4.98923 85.3382 4.98923C86.337 4.98923 87.1045 5.19742 87.6426 5.6138C88.1807 6.03019 88.5549 6.65328 88.7651 7.4826C88.9754 8.31192 89.0822 9.40752 89.0822 10.7694V12.741H84.1498V13.7036ZM84.2773 8.15677C84.1215 8.4032 84.0247 8.7859 83.9844 9.30453C83.944 9.82315 83.9242 10.5644 83.9242 11.5274V12.4592H86.4715V11.5274C86.4715 10.5758 86.4517 9.83449 86.4113 9.30846C86.371 8.78244 86.2741 8.39715 86.1184 8.15536C85.9626 7.91358 85.7181 7.79233 85.3838 7.79233C85.0495 7.79233 84.8009 7.91034 84.6382 8.14635L84.2773 8.15677Z" fill={isDark ? '#f1f1f1' : '#282828'}/>
                </g>
              </svg>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-0.5 -mt-2.5 font-roboto hidden sm:inline">PK</span>
            </div>
          </div>
        </div>

        {/* Center section - Search bar (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-[640px] mx-4 relative">
          <form onSubmit={handleSearch} className="flex flex-1">
            <div className={`flex flex-1 items-center border rounded-l-[20px] overflow-hidden transition-shadow ${searchFocused || showSuggestions ? 'border-[#1c62b9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:border-[#1c62b9] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]' : 'border-[#ccc] dark:border-[#303030]'}`}>
              {searchFocused && !showSuggestions && (
                <div className="pl-4">
                  <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  if (inputValue.trim()) setShowSuggestions(true);
                }}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search"
                className="w-full h-10 px-4 text-base outline-none bg-transparent placeholder-gray-500 dark:text-white dark:placeholder-gray-400 font-['Roboto',Arial,sans-serif]"
              />
              {inputValue && (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue('');
                      setShowSuggestions(false);
                      searchInputRef.current?.focus();
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="w-px h-6 bg-[#ccc] dark:bg-[#303030]" />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-[#f8f8f8] dark:bg-[#222] hover:bg-[#e8e8e8] dark:hover:bg-[#3a3a3a] border border-l-0 border-[#ccc] dark:border-[#303030] rounded-r-[20px] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </form>
          <button
            onClick={() => {
              setShowVoiceSearch(true);
              setIsListening(true);
              setVoiceText('');
            }}
            className="ml-3 p-3 bg-gray-100 dark:bg-[#272727] hover:bg-gray-200 dark:hover:bg-[#3f3f3f] rounded-full transition-colors"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && inputValue.trim() && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-12 mt-1 bg-white dark:bg-[#222] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
            >
              {/* Search for input */}
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
              >
                <Search className="w-4 h-4 text-gray-600 dark:text-gray-400 shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  Search for <span className="font-medium">{inputValue.trim()}</span>
                </span>
              </button>
              {/* Suggestion items */}
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left"
                >
                  <ArrowUpRight className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Theme toggle - hidden on mobile */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
          {/* Mobile search button */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Create dropdown - show on mobile only if signed in */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`${user ? 'flex' : 'hidden sm:flex'} items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors`} aria-label="Create">
                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700">
              <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]" onClick={() => setShowUploadDialog(true)}>
                <Upload className="w-5 h-5 mr-3" />
                Upload video
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]" onClick={() => toast.success('Go live setup would start')}>
                <Radio className="w-5 h-5 mr-3" />
                Go live
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]" onClick={() => toast.success('Shorts camera would open')}>
                <Clapperboard className="w-5 h-5 mr-3" />
                Create Short
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications popover - always visible on signed in mobile */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${user ? 'flex' : 'hidden sm:flex'} p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors relative`} aria-label="Notifications">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700 max-h-[500px] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-blue-600 dark:text-blue-400">
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-[420px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#3f3f3f] cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shrink-0"
                        style={{ backgroundColor: notification.channelColor }}
                      >
                        {notification.channelInitial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{notification.channelName}</span> {notification.text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.timeAgo}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismissNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full shrink-0 self-start"
                        aria-label="Dismiss notification"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center py-12">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User profile button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-1" aria-label="User menu">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-transparent hover:ring-blue-500 transition-all"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white dark:bg-[#282828] border-gray-200 dark:border-gray-700">
                <div className="px-3 py-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.email.split('@')[0]}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">
                  <User className="w-4 h-4 mr-3" />
                  Your channel
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">
                  <MonitorPlay className="w-4 h-4 mr-3" />
                  YouTube Studio
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]">
                  <Settings className="w-4 h-4 mr-3" />
                  Switch account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem
                  className="cursor-pointer text-gray-800 dark:text-gray-200 focus:bg-gray-100 dark:focus:bg-[#3f3f3f]"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={toggleAuthDialog}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-[15px] font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ml-1"
              aria-label="Sign in"
            >
              <LogIn className="w-[18px] h-[18px]" />
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      {/* Upload Dialog */}
      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-white dark:bg-[#0f0f0f] z-[60] md:hidden flex flex-col">
          <div className="flex items-center h-14 px-2 gap-2 shrink-0">
            <button onClick={() => { setShowSearch(false); setShowSuggestions(false); }} className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <form onSubmit={(e) => { handleSearch(e); setShowSearch(false); }} className="flex flex-1">
              <input
                ref={mobileSearchRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (inputValue.trim()) setShowSuggestions(true);
                }}
                placeholder="Search YouTube"
                className="w-full py-2 px-2 text-base outline-none bg-transparent dark:text-white"
                autoFocus
              />
            </form>
            <button
              onClick={() => {
                setShowVoiceSearch(true);
                setIsListening(true);
                setVoiceText('');
              }}
              className="p-2"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          {/* Mobile search suggestions */}
          {showSuggestions && inputValue.trim() && (
            <div
              ref={mobileSuggestionsRef}
              className="flex-1 overflow-y-auto bg-white dark:bg-[#0f0f0f]"
            >
              {/* Search for input */}
              <button
                onClick={() => { handleSearch(); setShowSearch(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors text-left"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
                <span className="text-sm text-gray-800 dark:text-gray-200 truncate">
                  Search for <span className="font-medium">{inputValue.trim()}</span>
                </span>
              </button>
              {/* Suggestion items */}
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`mobile-suggestion-${index}`}
                  onClick={() => handleMobileSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#272727] transition-colors text-left"
                >
                  <ArrowUpRight className="w-5 h-5 text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-800 dark:text-gray-200 truncate">{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <div className="fixed inset-0 bg-white dark:bg-[#0f0f0f] z-[70] flex flex-col items-center justify-center">
          <button
            onClick={() => {
              setShowVoiceSearch(false);
              setVoiceText('');
              setIsListening(true);
            }}
            className="absolute top-4 right-4 p-2"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {isListening ? (
            <>
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl text-gray-800 dark:text-white mb-2">Listening...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Try saying &quot;search for music videos&quot;</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <p className="text-xl text-gray-800 dark:text-white mb-2">&quot;{voiceText}&quot;</p>
              <div className="flex items-center gap-3 mt-4">
                <Button
                  onClick={handleVoiceSearch}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsListening(true);
                    setVoiceText('');
                  }}
                  className="rounded-full px-6"
                >
                  Try again
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
