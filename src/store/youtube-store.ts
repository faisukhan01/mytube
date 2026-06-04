import { create } from 'zustand';
import { Video, Comment } from '@/lib/youtube-data';

export type ViewMode = 'home' | 'player' | 'search' | 'shorts' | 'trending' | 'history' | 'liked' | 'watchlater' | 'subscriptions' | 'channel';

interface YouTubeState {
  currentView: ViewMode;
  currentVideo: Video | null;
  searchQuery: string;
  sidebarOpen: boolean;
  sidebarMini: boolean;
  selectedCategory: string;
  searchResults: Video[];
  comments: Comment[];
  likedVideos: string[];
  watchLater: string[];
  watchHistory: string[];
  isSearching: boolean;
  miniPlayerVideo: Video | null;

  // Actions
  setCurrentView: (view: ViewMode) => void;
  setCurrentVideo: (video: Video | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Video[]) => void;
  toggleSidebar: () => void;
  toggleSidebarMini: () => void;
  setSelectedCategory: (category: string) => void;
  setComments: (comments: Comment[]) => void;
  setIsSearching: (searching: boolean) => void;
  toggleLike: (videoId: string) => void;
  toggleWatchLater: (videoId: string) => void;
  addToHistory: (videoId: string) => void;
  setMiniPlayerVideo: (video: Video | null) => void;
  openVideo: (video: Video) => void;
  search: (query: string) => void;
  goHome: () => void;
}

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  currentView: 'home',
  currentVideo: null,
  searchQuery: '',
  sidebarOpen: true,
  sidebarMini: false,
  selectedCategory: 'All',
  searchResults: [],
  comments: [],
  likedVideos: [],
  watchLater: [],
  watchHistory: [],
  isSearching: false,
  miniPlayerVideo: null,

  setCurrentView: (view) => set({ currentView: view }),
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarMini: () => set((state) => ({ sidebarMini: !state.sidebarMini, sidebarOpen: !state.sidebarMini ? false : state.sidebarOpen })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setComments: (comments) => set({ comments }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  toggleLike: (videoId) => set((state) => ({
    likedVideos: state.likedVideos.includes(videoId)
      ? state.likedVideos.filter(id => id !== videoId)
      : [...state.likedVideos, videoId],
  })),
  toggleWatchLater: (videoId) => set((state) => ({
    watchLater: state.watchLater.includes(videoId)
      ? state.watchLater.filter(id => id !== videoId)
      : [...state.watchLater, videoId],
  })),
  addToHistory: (videoId) => set((state) => ({
    watchHistory: [videoId, ...state.watchHistory.filter(id => id !== videoId)],
  })),
  setMiniPlayerVideo: (video) => set({ miniPlayerVideo: video }),

  openVideo: (video) => {
    set({
      currentView: 'player',
      currentVideo: video,
    });
    get().addToHistory(video.id);
  },

  search: (query) => {
    set({ searchQuery: query, isSearching: true, currentView: 'search' });
  },

  goHome: () => set({
    currentView: 'home',
    currentVideo: null,
    searchQuery: '',
    searchResults: [],
  }),
}));
