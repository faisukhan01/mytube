'use client';

import { useState, useRef, useEffect } from 'react';
import { useYouTubeStore } from '@/store/youtube-store';
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  User,
  ArrowLeft,
  X,
} from 'lucide-react';

export default function YouTubeHeader() {
  const {
    searchQuery,
    sidebarOpen,
    toggleSidebar,
    search,
    goHome,
    setCurrentView,
  } = useYouTubeStore();

  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSearch, setShowSearch] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputValue.trim()) {
      search(inputValue.trim());
    }
  };

  const handleLogoClick = () => {
    goHome();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white z-50 flex items-center justify-between px-4 border-b border-gray-100">
        {/* Left section */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div
            className="flex items-center gap-0.5 cursor-pointer shrink-0"
            onClick={handleLogoClick}
          >
            {/* YouTube Logo */}
            <div className="flex items-center">
              <div className="relative w-8 h-5 mr-0.5">
                <svg viewBox="0 0 90 20" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                  <g>
                    <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
                    <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
                  </g>
                  <g>
                    <path d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z" fill="#282828"/>
                    <path d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5765 39.9058 13.3092V11.3831C39.9058 10.1034 40.0422 9.05518 40.3125 8.23073C40.5853 7.40628 41.0135 6.79146 41.5945 6.38304C42.1779 5.97462 42.9506 5.77051 43.9176 5.77051C44.8682 5.77051 45.6268 5.98108 46.1937 6.40221C46.7605 6.82334 47.1721 7.44525 47.4297 8.26643C47.6873 9.08761 47.8161 10.1359 47.8161 11.4061V13.3322C47.8161 14.5995 47.6849 15.6321 47.4199 16.4294C47.1549 17.2267 46.7378 17.8181 46.1684 18.1991C45.599 18.5826 44.8491 18.773 43.9176 18.773C42.9519 18.773 42.1341 18.5747 41.4697 18.1937ZM44.6353 16.2261C44.7982 15.8266 44.8783 15.2055 44.8783 14.3613V10.3152C44.8783 9.53463 44.7982 8.93554 44.6353 8.51195C44.4724 8.08836 44.1869 7.87779 43.7769 7.87779C43.3814 7.87779 43.105 8.08598 42.9487 8.50494C42.7924 8.92154 42.7142 9.52299 42.7142 10.3152V14.3613C42.7142 15.2055 42.7899 15.8266 42.9393 16.2261C43.0887 16.6256 43.365 16.8264 43.7651 16.8264C44.1746 16.8264 44.4724 16.6256 44.6353 16.2261Z" fill="#282828"/>
                    <path d="M56.8154 18.5634H54.6094L54.3648 17.0341H54.3037C53.7039 18.1871 52.8055 18.7636 51.6061 18.7636C50.7759 18.7636 50.1621 18.4646 49.7646 17.8665C49.3671 17.2685 49.1696 16.3958 49.1696 15.2484V6.01671H52.0742V14.9495C52.0742 15.5682 52.1288 16.0089 52.2403 16.2721C52.3518 16.5354 52.5464 16.667 52.8252 16.667C53.0559 16.667 53.277 16.5847 53.4887 16.4201C53.7004 16.2555 53.8567 16.0573 53.9575 15.8242V6.01671H56.8154V18.5634Z" fill="#282828"/>
                    <path d="M64.4755 3.68758H61.6768V18.5634H58.9181V3.68758H56.1194V1.41846H64.4755V3.68758Z" fill="#282828"/>
                    <path d="M72.6604 18.5634H70.4544L70.2098 17.0341H70.1487C69.5489 18.1871 68.6505 18.7636 67.4511 18.7636C66.6209 18.7636 66.0071 18.4646 65.6096 17.8665C65.2121 17.2685 65.0146 16.3958 65.0146 15.2484V6.01671H67.9192V14.9495C67.9192 15.5682 67.9738 16.0089 68.0853 16.2721C68.1968 16.5354 68.3914 16.667 68.6702 16.667C68.9009 16.667 69.122 16.5847 69.3337 16.4201C69.5454 16.2555 69.7017 16.0573 69.8025 15.8242V6.01671H72.6604V18.5634Z" fill="#282828"/>
                    <path d="M80.4993 7.69858C80.3098 6.8425 80.0042 6.2265 79.5773 5.84798C79.1529 5.46946 78.5738 5.2802 77.8445 5.2802C77.2746 5.2802 76.7471 5.44478 76.262 5.77159C75.7769 6.0984 75.3994 6.52755 75.1291 7.05862H75.0864V0.913086H72.2692V18.5634H74.6487L74.9524 17.3601H75.0147C75.2638 17.7943 75.6036 18.1297 76.0388 18.3664C76.474 18.6031 76.9508 18.7209 77.4692 18.7209C78.3764 18.7209 79.0581 18.2867 79.5143 17.4183C79.9705 16.5499 80.1975 15.2582 80.1975 13.5419V11.4061C80.1975 10.1467 80.0967 9.0974 79.8951 8.25773C79.7747 7.80233 79.6375 7.3786 79.4825 6.98767H80.4993V7.69858ZM77.3073 13.4265C77.3073 14.2802 77.2679 14.9519 77.1897 15.4418C77.1115 15.9316 76.9827 16.2853 76.8058 16.5006C76.6265 16.7183 76.3843 16.826 76.0768 16.826C75.8346 16.826 75.6135 16.7602 75.4136 16.6286C75.2136 16.4969 75.0573 16.3153 74.9467 16.0835V8.86676C75.0387 8.52463 75.2168 8.23739 75.4798 8.00374C75.7428 7.7701 76.026 7.65328 76.3303 7.65328C76.6306 7.65328 76.8633 7.77247 77.0318 8.00847C77.2003 8.24684 77.3183 8.62536 77.3849 9.1464C77.4515 9.66745 77.4848 10.3831 77.4848 11.2934V13.4265H77.3073Z" fill="#282828"/>
                    <path d="M84.1498 13.7036C84.1498 14.5259 84.1786 15.1519 84.234 15.5798C84.2895 16.0078 84.3992 16.3145 84.5619 16.4987C84.7246 16.6829 84.9722 16.775 85.3066 16.775C85.7555 16.775 86.0662 16.5857 86.2386 16.2072C86.4111 15.8287 86.5069 15.1886 86.5272 14.2866L89.0745 14.4359C89.0872 14.5688 89.0935 14.7544 89.0935 14.9916C89.0935 16.2498 88.7579 17.2002 88.0866 17.8427C87.4153 18.4852 86.4783 18.8064 85.2759 18.8064C83.8032 18.8064 82.7611 18.3087 82.1497 17.3134C81.5383 16.318 80.8325 14.7628 80.8325 12.6461V11.1903C80.8325 9.05782 81.5406 7.4861 82.1597 6.48735C82.7787 5.4886 83.8381 4.98923 85.3382 4.98923C86.337 4.98923 87.1045 5.19742 87.6426 5.6138C88.1807 6.03019 88.5549 6.65328 88.7651 7.4826C88.9754 8.31192 89.0822 9.40752 89.0822 10.7694V12.741H84.1498V13.7036ZM84.2773 8.15677C84.1215 8.4032 84.0247 8.7859 83.9844 9.30453C83.944 9.82315 83.9242 10.5644 83.9242 11.5274V12.4592H86.4715V11.5274C86.4715 10.5758 86.4517 9.83449 86.4113 9.30846C86.371 8.78244 86.2741 8.39715 86.1184 8.15536C85.9626 7.91358 85.7181 7.79233 85.3838 7.79233C85.0495 7.79233 84.8009 7.91034 84.6382 8.14635L84.2773 8.15677Z" fill="#282828"/>
                  </g>
                </svg>
              </div>
              <span className="text-[18px] font-bold tracking-tighter text-[#282828] ml-0.5">YouTube</span>
              <span className="text-[10px] text-gray-500 -mt-2 ml-0.5">PK</span>
            </div>
          </div>
        </div>

        {/* Center section - Search bar (desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-[640px] mx-4">
          <form onSubmit={handleSearch} className="flex flex-1">
            <div className={`flex flex-1 items-center border rounded-l-full overflow-hidden ${searchFocused ? 'border-blue-500 shadow-inner' : 'border-gray-300'}`}>
              {searchFocused && (
                <div className="pl-4">
                  <Search className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search"
                className="w-full py-2 px-4 text-base outline-none bg-transparent placeholder-gray-500"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="px-3 hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>
          <button
            onClick={() => setShowVoiceSearch(true)}
            className="ml-3 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Voice search"
          >
            <Mic className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Mobile search button */}
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Create">
            <Video className="w-5 h-5 text-gray-700" />
          </button>
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Notifications">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-1" aria-label="User profile">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-white z-[60] md:hidden">
          <div className="flex items-center h-14 px-2 gap-2">
            <button onClick={() => setShowSearch(false)} className="p-2">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <form onSubmit={(e) => { handleSearch(e); setShowSearch(false); }} className="flex flex-1">
              <input
                ref={mobileSearchRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search YouTube"
                className="w-full py-2 px-2 text-base outline-none bg-transparent"
                autoFocus
              />
            </form>
            <button
              onClick={() => setShowVoiceSearch(true)}
              className="p-2"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <div className="fixed inset-0 bg-white z-[70] flex flex-col items-center justify-center">
          <button
            onClick={() => setShowVoiceSearch(false)}
            className="absolute top-4 right-4 p-2"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Mic className="w-10 h-10 text-white" />
          </div>
          <p className="text-xl text-gray-800 mb-2">Listening...</p>
          <p className="text-sm text-gray-500">Try saying &quot;search for music videos&quot;</p>
        </div>
      )}
    </>
  );
}
