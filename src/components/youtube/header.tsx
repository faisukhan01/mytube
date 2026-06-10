'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import { homeVideos, shortsVideos } from '@/lib/youtube-data';
import {
  Menu,
  Search,
  Mic,
  Video,
  ArrowLeft,
  ArrowUpRight,
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
  LogIn,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export default function MyTubeHeader() {
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
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [themeRotating, setThemeRotating] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mobileSuggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Track scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 h-14 bg-white dark:bg-[#0f0f0f] z-50 flex items-center justify-between px-4 border-b border-gray-200/80 dark:border-gray-800/80 transition-shadow duration-200 ${isScrolled ? 'header-scrolled' : ''}`}>
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
            className="flex items-center gap-1.5 cursor-pointer shrink-0"
            onClick={handleLogoClick}
          >
            {/* Red play button — shown on all sizes */}
            <svg viewBox="0 0 28.57 20" className="h-5 w-auto" preserveAspectRatio="xMidYMid meet">
              <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
              <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
            </svg>
            {/* Text wordmark — hidden on mobile */}
            <span className="hidden sm:flex items-end leading-none select-none">
              <span className="text-[18px] font-bold tracking-tight text-gray-900 dark:text-white" style={{fontFamily:'Roboto,Arial,sans-serif', letterSpacing:'-0.5px'}}>MyTube</span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 ml-0.5 mb-0.5">PK</span>
            </span>
          </div>
        </div>

        {/* Center section - Search bar (desktop) */}
        <div className={`hidden md:flex items-center flex-1 mx-4 relative transition-all duration-200 ${searchFocused ? 'max-w-[660px]' : 'max-w-[640px]'}`}>
          <form onSubmit={handleSearch} className="flex flex-1 h-10">
            <div className={`flex flex-1 h-10 items-center border rounded-l-[20px] overflow-hidden transition-shadow ${searchFocused || showSuggestions ? 'border-[#ccc] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] dark:border-[#555]' : 'border-[#ccc] dark:border-[#303030]'}`}>
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
                className="w-full h-10 px-4 text-base outline-none ring-0 focus:outline-none focus:ring-0 bg-transparent placeholder-gray-500 dark:text-white dark:placeholder-gray-400 caret-gray-600 dark:caret-gray-300 font-['Roboto',Arial,sans-serif]"
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
              className="h-10 px-5 bg-[#f8f8f8] dark:bg-[#222] hover:bg-[#e8e8e8] dark:hover:bg-[#3a3a3a] border border-l-0 border-[#ccc] dark:border-[#303030] rounded-r-[20px] transition-colors flex items-center justify-center outline-none focus:outline-none"
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
            onClick={() => {
              setThemeRotating(true);
              toggleTheme();
              setTimeout(() => setThemeRotating(false), 500);
            }}
            className={`hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-transform duration-500 ${themeRotating ? 'rotate-180' : ''}`}
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


          {/* User profile button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ml-1" aria-label="User menu">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm ring-2 ring-transparent hover:ring-blue-500 hover:scale-105 transition-all duration-200"
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
                  MyTube Studio
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
              className="flex items-center gap-1.5 px-4 py-1.5 border border-[#065fd4] text-[#065fd4] dark:text-[#3ea6ff] dark:border-[#3ea6ff] rounded-full text-sm font-medium bg-transparent hover:bg-[#def] dark:hover:bg-blue-900/20 transition-all duration-200 ml-1"
              aria-label="Sign in"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </button>
          )}
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      {/* Upload Dialog */}
      <UploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} />

      {/* Mobile Search Overlay - smooth transition */}
      {showSearch && (
        <div className="fixed inset-0 bg-white dark:bg-[#0f0f0f] z-[60] md:hidden flex flex-col animate-fade-in">
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
                placeholder="Search MyTube"
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
